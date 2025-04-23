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

export default function ConsultarDocumento() {
    // Estados para gerir o utilizador, comentários, erros e avaliações
    const [comentario, setComentario] = useState("");
    const [comentarios, setComentarios] = useState([]);
    const [erro, setErro] = useState("");
    const [isClient, setIsClient] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");
    const [titulo, setTitulo] = useState("Documento Sem Título");
    const [autor, setAutor] = useState("Autor Desconhecido");
    const [tipoUtilizador, setTipoUtilizador] = useState(null);
    const [avaliacao, setAvaliacao] = useState(0); // Avaliação do usuário atual
    const [avaliacaoHover, setAvaliacaoHover] = useState(0);
    const [avaliacaoMedia, setAvaliacaoMedia] = useState(0); // Média de todas as avaliações
    const [totalAvaliacoes, setTotalAvaliacoes] = useState(0); // Número total de avaliações

    const searchParams = useSearchParams();

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
    }, [searchParams]);

    // Efeito para obter os dados do utilizador atual
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) throw error;

                if (user) {
                    const { data: userData, error: userError } = await supabase
                        .from('user_details')
                        .select('*')
                        .eq('id_user', user.id)
                        .single();
                    
                    if (userError) throw userError;
                    
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
                const { data: document, error: docError } = await supabase
                    .from('user_documents')
                    .select('*')
                    .eq('name', titulo)
                    .maybeSingle();
                if (docError) throw docError;

                const { data, error } = await supabase
                    .from('comment_user')
                    .select('*')
                    .eq('document_id', document.id)
                    .order('created_at', { ascending: false });
                if (error) throw error;
    
                setComentarios(data || []);
            } catch (error) {
                setErro("Erro ao carregar comentários: " + error.message);
            }
        };
    
        if (pdfUrl) {
            fetchComentarios();
        }
    }, [pdfUrl]);

    // Função para buscar a avaliação média do documento
    const fetchAvaliacaoMedia = async () => {
        try {
            // Buscar o documento pelo título
            const { data: document, error: docError } = await supabase
                .from('user_documents')
                .select('id')
                .eq('name', titulo)
                .maybeSingle();
            
            if (docError) throw docError;
            if (!document) return;

            // Buscar todas as avaliações para este documento
            const { data: ratings, error: ratingsError } = await supabase
                .from('ratings')
                .select('rating')
                .eq('doc_id', document.id);
            
            if (ratingsError) throw ratingsError;

            // Calcular a média
            if (ratings && ratings.length > 0) {
                const soma = ratings.reduce((acc, curr) => acc + curr.rating, 0);
                const media = soma / ratings.length;
                setAvaliacaoMedia(media);
                setTotalAvaliacoes(ratings.length);
            } else {
                setAvaliacaoMedia(0);
                setTotalAvaliacoes(0);
            }
        } catch (error) {
            console.error("Erro ao buscar avaliação média:", error.message);
        }
    };

    // Efeito para buscar a avaliação do usuário atual e a média
    useEffect(() => {
        const fetchAvaliacoes = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: document } = await supabase
                    .from('user_documents')
                    .select('id')
                    .eq('name', titulo)
                    .maybeSingle();
                
                if (!document) return;

                // Buscar avaliação do usuário atual
                const { data: avaliacaoData } = await supabase
                    .from('ratings')
                    .select('rating')
                    .eq('user_id', user.id)
                    .eq('doc_id', document.id)
                    .single();
                
                if (avaliacaoData) {
                    setAvaliacao(avaliacaoData.rating);
                }

                // Buscar avaliação média
                await fetchAvaliacaoMedia();
            } catch (error) {
                console.error("Erro ao buscar avaliações:", error.message);
            }
        };
    
        if (pdfUrl) fetchAvaliacoes();
    }, [pdfUrl]);

    // Adicionar um novo comentário
    const addComment = async (e) => {
        e.preventDefault();

        if (!comentario.trim()) {
            setErro("Por favor, escreva um comentário");
            return;
        }

        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;
            if (!user?.id) throw new Error("Utilizador não autenticado");

            const { data: userData, error: userDataError } = await supabase
                .from('user_details')
                .select('nome, id_tipo_user')
                .eq('id_user', user.id)
                .maybeSingle();

            if (userDataError) throw userDataError;

            const { data: document, error: docError } = await supabase
                .from('user_documents')
                .select('id')
                .eq('name', titulo)
                .maybeSingle();
            if (docError) throw docError;

            const sendComment = {
                created_at: new Date(),
                text: comentario,
                user_id: user.id,
                author: userData.nome,
                document_id: document.id,
            };

            const { data: novoComentario, error } = await supabase
                .from('comment_user')
                .insert([sendComment])
                .select()
                .single();

            if (error) throw error;

            setComentarios([novoComentario, ...comentarios]);
            setComentario("");
            setErro("");

        } catch (error) {
            setErro("Erro: " + error.message);
        }
    };

    // Remover comentário
    const removeComment = async (id) => {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;
    
            const { data: userDetails, error: detailsError } = await supabase
                .from('user_details')
                .select('id_tipo_user')
                .eq('id_user', user.id)
                .single();
    
            if (detailsError) throw detailsError;
    
            if (userDetails.id_tipo_user !== 2) {
                setErro("Apenas moderadores podem remover comentários");
                return;
            }
    
            const { error: deleteError } = await supabase
                .from('comment_user')
                .delete()
                .eq('id', id);
    
            if (deleteError) throw deleteError;
    
            setComentarios(comentarios.filter(comment => comment.id !== id));
            setErro("");
    
        } catch (error) {
            setErro("Erro ao remover comentário: " + error.message);
        }
    };

    // AVALIAÇÃO
    const handleRating = async (rating) => {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;

            const { data: document, error: docError } = await supabase
                .from('user_documents')
                .select('id')
                .eq('name', titulo)
                .maybeSingle();
            if (docError) throw docError;

            setAvaliacao(rating);

            const sendRating = {
                user_id: user.id,
                doc_id: document.id,
                rating: rating,
                created_at: new Date(),
            }

            // Exclui avaliações anteriores do usuário para este documento
            const { error: deleteError } = await supabase
                .from('ratings')
                .delete()
                .eq('user_id', user.id)
                .eq('doc_id', document.id);

            if (deleteError) throw deleteError;

            // Insere a nova avaliação
            const { error } = await supabase
                .from('ratings')
                .insert([sendRating]);

            if (error) {
                setErro("Erro ao submeter avaliação: " + error.message);
            } else {
                setAvaliacao(rating);
                setErro("");
                // Atualiza a média após nova avaliação
                await fetchAvaliacaoMedia();
            }
        } catch (error) {
            setErro("Erro ao avaliar: " + error.message);
        }
    }

    return (
        <>
            <HeaderInicio />

            <div className={`${kanit.className} w-full min-h-[calc(100vh-80px)] flex items-center`}>
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-20">
                        {/* Coluna do documento PDF */}
                        <div className="bg-[#012B55] lg:col-span-3 rounded-xl shadow-lg overflow-hidden w-9/10">
                            <div className="p-6 md:p-10 w-3/4 flex mx-auto flex-col">
                                <h1 className="text-white font-extrabold text-3xl md:text-5xl">{titulo}</h1>
                                <p className="py-2 text-white text-xl md:text-2xl"><strong>Autor:</strong> {autor}</p>

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
                            {/* Seção de avaliação média */}
                            <div className="py-5 text-center border-b border-gray-600">
                                <div className="flex flex-col items-center">
                                    <span className="text-white text-2xl font-bold mb-2">
                                        Avaliação Média
                                    </span>
                                    <div className="flex justify-center items-center mb-2">
                                        {[...Array(5)].map((_, index) => {
                                            const difference = avaliacaoMedia - index;
                                            
                                            // Lógica para determinar o tipo de estrela:
                                            // - Completa: se a diferença for >= 1
                                            // - Parcial: se a diferença estiver entre 0 e 1
                                            // - Vazia: se a diferença for <= 0
                                            return (
                                                <span
                                                    key={index}
                                                    className="text-2xl text-gray-400 relative"
                                                >
                                                    <FaRegStar />
                                                    {difference > 0 && (
                                                        <span 
                                                            className="text-yellow-400 absolute top-0 left-0 overflow-hidden"
                                                            style={{ 
                                                                width: `${Math.min(difference, 1) * 100}%` 
                                                            }}
                                                        >
                                                            <FaStar />
                                                        </span>
                                                    )}
                                                </span>
                                            );
                                        })}
                                    </div>
                                    <span className="text-white text-xl">
                                    {avaliacaoMedia.toFixed(1)} ({totalAvaliacoes} {totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'})
                                    </span>
                                </div>
                            </div>

                            {/* Seção de avaliação do usuário */}
                            <div className="py-5 text-center border-b border-gray-600">
                                <div className="flex flex-col items-center">
                                    <span className="text-white text-2xl font-bold mb-2">
                                        A sua Avaliação
                                    </span>
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
                                                        className="cursor-pointer text-2xl transition-transform hover:scale-110"
                                                        style={{
                                                            color: valorAvaliacao <= (avaliacaoHover || avaliacao) 
                                                                ? "#facc15" 
                                                                : "#9ca3af"
                                                        }}
                                                    >
                                                        {valorAvaliacao <= (avaliacaoHover || avaliacao) ? (
                                                            <FaStar />
                                                        ) : (
                                                            <FaRegStar />
                                                        )}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                    <span className="text-white text-xl mt-2">
                                        {avaliacao > 0 ? `Avaliou com ${avaliacao} estrelas`  : "Avalie este documento"}
                                    </span>
                                </div>
                            </div>

                            {/* Seção de comentários */}
                            <div className="flex flex-col flex-grow">
                                <div className="flex-grow max-h-[40vh] overflow-y-auto px-4 py-5">
                                    {comentarios.length > 0 ? (
                                        comentarios.map((comment, index) => (
                                            <div key={index} className="mb-10 transition-all duration-300 group">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <Image src="/user.png" width={30} height={30} alt="foto de perfil" className="w-8 h-8" />
                                                        <span className="ml-2 text-xl text-white">{comment.author}</span>
                                                    </div>
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
                                                <div className="mt-2 bg-[#0369A9] rounded-3xl p-4 text-white">
                                                    <p className="text-lg">{comment.text}</p>
                                                    <div className="flex justify-end mt-2">
                                                        <button className="mr-3">
                                                            <Image src="/thumbs_down.png" alt="dislike" width={30} height={30} className="w-6 h-6" />
                                                        </button>
                                                        <button>
                                                            <Image src="/thumbs_up.png" alt="like" width={30} height={30} className="w-6 h-6" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="text-white"><TempoRelativo data={comment.created_at} /></div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-white text-center">Nenhum comentário ainda</p>
                                    )}
                                </div>

                                {/* Formulário para adicionar novo comentário */}
                                <div className="mb-5 px-2 py-5 mt-auto">
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
                                    {erro && <p className="text-red-500 text-sm mt-2">{erro}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}