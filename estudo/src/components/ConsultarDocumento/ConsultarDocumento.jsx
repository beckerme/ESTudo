"use client";
import Image from "next/image";
import HeaderInicio from "../HeaderInicio";
import ListaDocumentos from "../ListaDocumentos";
import { Kanit } from "next/font/google";
import React, { useState } from 'react';
import supabase from "@/app/config/supabaseClient";
import TempoRelativo from "./TempoRelativo";

// Font
const kanit = Kanit({
    subsets: ['latin'],
    weight: ["400","700","800"],
});

export default function ConsultarDocumento() {

    /* -------------------------------------------------------------------------------- BACKEND -------------------------------------------------------------- */

    // Estados para gerir os comentários
    const [comentario, setComentario] = useState("");
    const [comentarios, setComentarios] = useState([]);
    const [erro, setErro] = useState("");

    // Carrega os comentários da base de dados
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

    // Função para obter o ID do utilizador atual
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
            // Obtem as informações do utilizador
            const userId = await getCurrentUserId();
            const { data: userData, error: userDataError } = await supabase
                .from('user_details')
                .select('nome')
                .eq('id_user', userId)
                .maybeSingle();
            
            if (userDataError) throw userDataError;

            // Prepara os dados do comentário para serem inseridos na BD
            const sendComment = {
                created_at: new Date(),
                text: comentario,
                user_id: userId,
                author: userData.nome,
            }

            // Insere os comentários na BD
            const { data: novoComentario, error } = await supabase
                .from('comment_user')
                .insert([sendComment])
                .select()
                .single();
            
            if (error) throw error;
            
            // Atualiza a lista de comentários
            setComentarios([novoComentario, ...comentarios]);

            // Apaga o campo do input de comentar dps da submissão do mesmo
            setComentario("");
            setErro("");
            
        } catch (error) {
            setErro("Erro: " + error.message);
        }
    }

    return (
        /* -------------------------------------------------------------------------- FRONTEND ---------------------------------------------------------------- */

        <>
            <HeaderInicio />
            <div className={`${kanit.className} w-full min-h-[calc(100vh-80px)] flex items-center`}>
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-20">
                        {/* Div Documento */}
                        <div className="bg-[#012B55] lg:col-span-3 rounded-xl shadow-lg overflow-hidden w-9/10">
                            {/* Título e Autor */}
                            <div className="p-6 md:p-10 w-3/4 flex mx-auto flex-col">
                                <h1 className="text-white font-extrabold text-3xl md:text-5xl">Melhores Apontamentos POO</h1>
                                <p className="py-2 text-white text-xl md:text-2xl"><strong>Autor:</strong> Felizbelo</p>

                                {/* Conteúdo Documento */}
                                <div className="mt-2 bg-[#0369A9] rounded-lg flex items-center justify-center h-[50vh] md:h-[60vh]">
                                    <span className="text-5xl md:text-6xl text-white"><ListaDocumentos/></span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Div Comentário e Avaliação */}
                        <div className="bg-[#012B55] rounded-xl shadow-lg overflow-hidden flex flex-col px-5">

                            {/* Avaliação */}
                            <div className="py-10 text-center">
                                <div className="flex justify-center items-center">
                                    <span className="text-white text-4xl font-bold">4,5/5</span>
                                    <Image src="/star.png" width={30} height={30} alt="estrela" className="w-8 h-8 ml-2"/>
                                </div>
                                <div className="flex justify-center mt-2">
                                    <Image src="/5_stars.png" width={200} height={40} alt="rating de 4,5 estrelas" className="h-8" />
                                </div>
                            </div>
                            
                            {/* Div Comentário */}
                            <div className="flex flex-col">

                                <div className="flex-grow max-h-[50vh] overflow-y-auto px-4 py-2 ">
                                    {/* Mostra comentários existentes */}
                                    {comentarios.length > 0 ? (
                                        comentarios.map((comment, index) => (
                                            <div key={index} className="mb-10 transition-all duration-300">
                                                <div className="flex items-center">
                                                    <Image src="/user.png" width={30} height={30} alt="foto de perfil" className="w-8 h-8"/>
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

                                {/* Adicionar Comentário */}
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
                                                <Image src="/send.png" width={40} height={40} alt="enviar"/>
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