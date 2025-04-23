"use client";
import Image from "next/image";
import HeaderInicio from "../HeaderInicio";
import { Kanit } from "next/font/google";
import React, { useEffect, useState } from 'react';
import supabase from "@/app/config/supabaseClient";
import TempoRelativo from "./TempoRelativo";
import { useSearchParams } from "next/navigation";
import PDFViewer from "../PdfViewer";
import { FaStar, FaRegStar } from "react-icons/fa";

// Configuração da Fonte para o Projeto
const kanit = Kanit({
    subsets: ['latin'],
    weight: ["400", "700", "800"],
});

/* ----------------------------------------------------------------------------------- BACKEND ---------------------------------------------------------------- */
export default function ConsultarDocumento() {

    // Estados para gerir o utilizador, comentários e erros
    const [comentario, setComentario] = useState("");               // Armazena o comentário atual sendo escrito
    const [comentarios, setComentarios] = useState([]);             // Lista de todos os comentários
    const [erro, setErro] = useState("");                           // Mensagens de erro
    const [isClient, setIsClient] = useState(false);                // Verifica se o componente está no lado do cliente
    const [pdfUrl, setPdfUrl] = useState("");                       // URL do PDF a ser exibido
    const [titulo, setTitulo] = useState("Documento Sem Título");   // Título do documento
    const [autor, setAutor] = useState("Autor Desconhecido");       // Autor do documento
    const [tipoUtilizador, setTipoUtilizador] = useState(null);     // Tipo de utilizador (ex: 1-admin, 2-moderador, 3-aluno, 4-user_nao_validado, 5-user_inativo)
    const [avaliacao, setAvaliacao] = useState(0);                  // Avaliação do documento
    const [avaliacaoHover, setAvaliacaoHover] = useState(0);        // Avaliação em hover

    // Obter os parâmetros da URL
    const searchParams = useSearchParams();

    // Efeito para executar apenas no lado do cliente
    useEffect(() => {
        setIsClient(true);

        // Se existirem parâmetros na URL, extrai-os
        if (searchParams) {
            const pdf = searchParams.get("pdf");
            const title = searchParams.get("titulo");
            const author = searchParams.get("autor");

            // Atualiza os estados com os valores da URL ou valores padrão
            setPdfUrl(pdf || "");
            setTitulo(title || "Documento Sem Título");
            setAutor(author || "Autor Desconhecido");
        }
    }, [searchParams]);

    // Efeito para obter os dados do utilizador atual
    useEffect(() => {
        setIsClient(true);
        if (searchParams) {
            const pdf = searchParams.get("pdf");
            const title = searchParams.get("titulo");
            const author = searchParams.get("autor");

            setPdfUrl(pdf || "");
            setTitulo(title || "Documento Sem Título");
            setAutor(author || "Autor Desconhecido");
        }

        
        // DADOS DO UTILIZADOR
        const fetchCurrentUser = async () => {
            try {

                // Obter o utilizador autenticado
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) throw error;

                // Se existir um utilizador autenticado, obter os detalhes do utilizador
                if (user) {
                    const { data: userData, error: userError } = await supabase
                        .from('user_details')
                        .select('*')
                        .eq('id_user', user.id)
                        .single();
                    
                    if (userError) throw userError;
                    
                    // Atualiza o estado do tipo de utilizador com o ID e o tipo de utilizador
                    setTipoUtilizador({
                        id: user.id,
                        tipo: userData.id_tipo_user
                    });
                }
            } catch (error) {
                console.error("Error fetching current user:", error);
            }
        };

        fetchCurrentUser();
    }, [searchParams]);

    
    // COMENTÁRIOS
    useEffect(() => {
        const fetchComentarios = async () => {
            try {

                // Obter o ID do documento baseado no URL
                const { data: document, error: docError } = await supabase
                    .from('user_documents')
                    .select('*')
                    .eq('name', titulo)
                    .maybeSingle();
                if (docError) throw docError;

                // Obter os comentários associados ao documento em questão
                const { data, error } = await supabase
                    .from('comment_user')
                    .select('*')
                    .eq('document_id', document.id)
                    .order('created_at', { ascending: false });
                if (error) throw error;
    
                // Atualiza o estado dos comentários com os dados obtidos
                setComentarios(data || []);
            } catch (error) {
                setErro("Erro ao carregar comentários: " + error.message);
            }
        };
    
        // Verifica se a URL do PDF está definida antes de obter os comentários
        if (pdfUrl) {
            fetchComentarios();
        }
    }, [pdfUrl]);

    // Adicionar um novo comentário
    const addComment = async (e) => {
        e.preventDefault();

        // Verifica se o campo de comentário não está vazio
        if (!comentario.trim()) {
            setErro("Por favor, escreva um comentário");
            return;
        }

        try {
            // Obter o utilizador autenticado
            const { data: user, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;

            // Obtém os detalhes do utilizador (nome e tipo de utilizador)
            const { data: userData, error: userDataError } = await supabase
                .from('user_details')
                .select('nome, id_tipo_user')
                .eq('id_user', user.id)
                .maybeSingle();

            if (userDataError) throw userDataError;

            // 🔍 Buscar o ID do documento atual com base no PDF
            const { data: document, error: docError } = await supabase
                .from('user_documents')
                .select('id')
                .eq('name', titulo)
                .maybeSingle();
            if (docError) throw docError;

            // Cria o objeto do comentário a ser enviado
            const sendComment = {
                created_at: new Date(),         // Data atual
                text: comentario,               // Texto do comentário
                user_id: user.id,               // ID do utilizador
                author: userData.nome,          // Nome do autor
                document_id: document.id,       // ID do documento
            };

            // Insere o novo comentário na base de dados
            const { data: novoComentario, error } = await supabase
                .from('comment_user')
                .insert([sendComment])
                .select()
                .single();

            if (error) throw error;

            // Atualiza a lista de comentários com o novo comentário
            setComentarios([novoComentario, ...comentarios]);
            setComentario("");
            setErro("");

        } catch (error) {
            setErro("Erro: " + error.message);
        }
    };

    // Remover comentário
    // Apenas moderadores (tipo_user === 2) podem remover comentários
    const removeComment = async (id) => {
        try {
            // Obter o utilizador atual
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;
    
            // Obter os dados do utilizador na base de dados
            const { data: userDetails, error: detailsError } = await supabase
                .from('user_details')
                .select('id_tipo_user')
                .eq('id_user', user.id)
                .single();
    
            if (detailsError) throw detailsError;
    
            // Verifica se o tipo de utilizador é igual a moderador (tipo_user === 2)
            if (userDetails.id_tipo_user !== 2) {
                setErro("Apenas moderadores podem remover comentários");
                return;
            }
    
            // Se é moderador, eliminar o comentário ao clicar no caixote do lixo
            const { error: deleteError } = await supabase
                .from('comment_user')
                .delete()
                .eq('id', id);
    
            if (deleteError) throw deleteError;
    
            // Atualizar a UI ao atualizar a lista de comentários
            setComentarios(comentarios.filter(comment => comment.id !== id));
            setErro("");
    
        } catch (error) {
            setErro("Erro ao remover comentário: " + error.message);
        }
    };

    // AVALIAÇÃO
    const handleRating = async (rating) => {

        // 🔍 Obter o utilizador atual
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;

        // 🔍 Buscar o ID do documento atual com base no PDF
        const { data: document, error: docError } = await supabase
            .from('user_documents')
            .select('id')
            .eq('name', titulo)
            .maybeSingle();
        if (docError) throw docError;

        // 🔁 Atualiza a função localmente
        setAvaliacao(rating);

        // 💾 Criar o objeto da avalição a ser enviado para o supabase
        const sendRating = {
            user_id: user.id,
            doc_id: document.id,
            rating: rating,
            created_at: new Date(),
        }

        // ⚠️ Exclui todas as avaliações anteriores do usuário para o documento
        const { error: deleteError } = await supabase
            .from('ratings')
            .delete()
            .eq('user_id', user.id)
            .eq('doc_id', document.id);

        if (deleteError) throw deleteError;

        // 💾 Insere o novo rating
        const {error} = await supabase
            .from('ratings')
            .insert([sendRating]);

        if (error) {
            setErro("Erro ao submeter avaliação: " + error.message);
        }
        else {
            setAvaliacao(rating);
            setErro("");
        }
    }

    // Efeito para carregar a avaliação
    useEffect(() => {
        const fetchAvaliacao = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
    
                const { data: document } = await supabase
                    .from('user_documents')
                    .select('id')
                    .eq('name', titulo)
                    .maybeSingle();
    
                if (!document) return;
    
                const { data: avaliacaoData, error } = await supabase
                    .from('ratings')
                    .select('rating')
                    .eq('user_id', user.id)
                    .eq('doc_id', document.id)
                    .single();
    
                if (avaliacaoData) {
                    setAvaliacao(avaliacaoData.rating);
                }
            } catch (error) {
                console.error("Erro ao buscar avaliação:", error.message);
            }
        };
    
        if (pdfUrl) fetchAvaliacao();
    }, [pdfUrl]);
    

    return (
        <>
            {/* Barra Topo */}
            <HeaderInicio />

            {/* Conteiner Principal */}
            <div className={`${kanit.className} w-full min-h-[calc(100vh-80px)] flex items-center`}>

                <div className="container mx-auto">

                    {/* Grid com duas colunas (3/4 para documento, 1/4 para comentários) */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-20">

                        {/* Coluna do documento PDF */}
                        <div className="bg-[#012B55] lg:col-span-3 rounded-xl shadow-lg overflow-hidden w-9/10">
                            <div className="p-6 md:p-10 w-3/4 flex mx-auto flex-col">
                            
                                {/* Título e autor do documento */}
                                <h1 className="text-white font-extrabold text-3xl md:text-5xl">{titulo}</h1>
                                <p className="py-2 text-white text-xl md:text-2xl"><strong>Autor:</strong> {autor}</p>

                                {/* Visualizador de PDF */}
                                <div className="mt-2 bg-[#0369A9] rounded-lg flex items-center justify-center h-[50vh] md:h-[60vh]">
                                    {isClient && pdfUrl ? (
                                        <PDFViewer url={pdfUrl} />
                                    ) : (
                                        <p className="text-white text-xl">Carregando documento...</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Coluna dos comentários e avaliações */}
                        <div className="bg-[#012B55] rounded-xl shadow-lg overflow-hidden flex flex-col px-5">

                            {/* Secção de avaliação */}
                            <div className="py-10 text-center">
                                <div className="flex justify-center items-center mb-4">
                                    {/* Avaliação em Hover */}
                                    <span className="text-white text-4xl font-bold">{avaliacao > 0 ? `${avaliacao}/5` : "Avalie"}</span>
                                </div>

                                {/* Estrelas de avaliação (com react-icons) */}
                                <div className="flex justify-center">
                                    {[...Array(5)].map((_, index) => {
                                        const valorAvaliacao = index + 1;
                                        return (
                                            <label key={index}>
                                                <input
                                                    type="radio"
                                                    name="rating"
                                                    value={valorAvaliacao}
                                                    onChange={() => handleRating(valorAvaliacao)}
                                                    className="hidden"
                                                />
                                                <span
                                                    onMouseEnter={() => setAvaliacaoHover(valorAvaliacao)}
                                                    onMouseLeave={() => setAvaliacaoHover(null)}
                                                    className="cursor-pointer text-yellow-400 text-3xl transition-transform hover:scale-110"
                                                >
                                                    {valorAvaliacao <= (avaliacaoHover || avaliacao) ? <FaStar /> : <FaRegStar />}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Secção dos comentários */}
                            <div className="flex flex-col">

                                {/* Lista de comentários com scroll */}
                                <div className="flex-grow max-h-[50vh] overflow-y-auto px-4 py-2 ">
                                    {comentarios.length > 0 ? (
                                        comentarios.map((comment, index) => (
                                            <div key={index} className="mb-10 transition-all duration-300 group">

                                                {/* Cabeçalho do comentário (autor + botão eliminar) */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <Image src="/user.png" width={30} height={30} alt="foto de perfil" className="w-8 h-8" />
                                                        <span className="ml-2 text-xl text-white">{comment.author}</span>
                                                    </div>

                                                    {/* Botão de eliminar (só visível para moderadores) */}
                                                    {tipoUtilizador?.tipo === 2 && (
                                                        <button 
                                                            onClick={() => removeComment(comment.id)}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                                                            title="Excluir comentário"
                                                        >
                                                            <Image src="/trash.png" width={20} height={20} alt="excluir" />
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Corpo do comentário */}
                                                <div className="mt-2 bg-[#0369A9] rounded-3xl p-4 text-white">
                                                    <p className="text-lg">{comment.text}</p>

                                                    {/* Botões de like/dislike */}
                                                    <div className="flex justify-end mt-2">
                                                        <button className="mr-3">
                                                            <Image src="/thumbs_down.png" alt="dislike" width={30} height={30} className="w-6 h-6" />
                                                        </button>
                                                        <button>
                                                            <Image src="/thumbs_up.png" alt="like" width={30} height={30} className="w-6 h-6" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Data do comentário (tempo relativo) */}
                                                <div className="text-white"><TempoRelativo data={comment.created_at} /></div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-white text-center">Nenhum comentário ainda</p>
                                    )}
                                </div>

                                {/* Formulário para adicionar novo comentário */}
                                <div className="mb-5 px-2 py-10">
                                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                        <div className="flex-grow bg-white text-black rounded-full py-2 px-4 shadow-md">
                                            <form onSubmit={addComment} className="w-full">
                                                <input
                                                    type="text"
                                                    placeholder="Adicione um Comentário"
                                                    className="w-full bg-transparent outline-none text-sm sm:text-base"
                                                    value={comentario}
                                                    onChange={(e) => setComentario(e.target.value)}
                                                />
                                            </form>
                                        </div>
                                        <div className="flex justify-end sm:justify-center">
                                            <button
                                                className="p-1 hover:scale-110 transition-transform"
                                                onClick={addComment}
                                            >
                                                <Image src="/send.png" width={40} height={40} alt="enviar" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Mensagens de erro */}
                                {erro && <p className="text-red-500 text-sm mt-2">{erro}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
