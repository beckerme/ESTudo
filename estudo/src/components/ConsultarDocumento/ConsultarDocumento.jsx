"use client";
import Image from "next/image";
import HeaderInicio from "../HeaderInicio";
import { Kanit } from "next/font/google";
import React, { useEffect, useState } from 'react';
import supabase from "@/app/config/supabaseClient";
import TempoRelativo from "./TempoRelativo";
import { useSearchParams } from "next/navigation";
import PDFViewer from "../PdfViewer";

// Font
const kanit = Kanit({
    subsets: ['latin'],
    weight: ["400", "700", "800"],
});

export default function ConsultarDocumento() {
    const [comentario, setComentario] = useState("");
    const [comentarios, setComentarios] = useState([]);
    const [erro, setErro] = useState("");
    const [isClient, setIsClient] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");
    const [titulo, setTitulo] = useState("Documento Sem Título");
    const [autor, setAutor] = useState("Autor Desconhecido");

    const searchParams = useSearchParams();

    // Executar apenas no lado do cliente
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

    useEffect(() => {
        const fetchComentarios = async () => {
            try {
                const { data, error } = await supabase
                    .from('comment_user')
                    .select('*')
                    .order('created_at', { ascending: true });

                if (error) throw error;

                setComentarios(data || []);
            } catch (error) {
                setErro("Erro ao carregar comentários: " + error.message);
            }
        };

        fetchComentarios();
    }, []);

    const getCurrentUserId = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user.id;
    };

    const addComment = async (e) => {
        e.preventDefault();
        if (!comentario.trim()) {
            setErro("Por favor, escreva um comentário");
            return;
        }

        try {
            const userId = await getCurrentUserId();
            const { data: userData, error: userDataError } = await supabase
                .from('user_details')
                .select('nome')
                .eq('id_user', userId)
                .maybeSingle();

            if (userDataError) throw userDataError;

            const sendComment = {
                created_at: new Date(),
                text: comentario,
                user_id: userId,
                author: userData.nome,
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

    return (
        <>
            <HeaderInicio />
            <div className={`${kanit.className} w-full min-h-[calc(100vh-80px)] flex items-center`}>
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-20">
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

                        <div className="bg-[#012B55] rounded-xl shadow-lg overflow-hidden flex flex-col px-5">
                            <div className="py-10 text-center">
                                <div className="flex justify-center items-center">
                                    <span className="text-white text-4xl font-bold">4,5/5</span>
                                    <Image src="/star.png" width={30} height={30} alt="estrela" className="w-8 h-8 ml-2" />
                                </div>
                                <div className="flex justify-center mt-2">
                                    <Image src="/5_stars.png" width={200} height={40} alt="rating de 4,5 estrelas" className="h-8" />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <div className="flex-grow max-h-[50vh] overflow-y-auto px-4 py-2 ">
                                    {comentarios.length > 0 ? (
                                        comentarios.map((comment, index) => (
                                            <div key={index} className="mb-10 transition-all duration-300">
                                                <div className="flex items-center">
                                                    <Image src="/user.png" width={30} height={30} alt="foto de perfil" className="w-8 h-8" />
                                                    <span className="ml-2 text-xl text-white">{comment.author}</span>
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
                                {erro && <p className="text-red-500 text-sm mt-2">{erro}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
