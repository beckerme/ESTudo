'use client';

// Imports necessários
import { Kanit } from "next/font/google";
import HeaderInicio from "../HeaderInicioAluno";
import React, { useState } from 'react';
import { Upload, Search } from 'lucide-react';
import supabase from "@/app/config/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


// Fonte Kanit
const kanit = Kanit({
	subsets: ['latin'],
	weight: "400",
});

export default function SubmeterDocumento() {

	// Estados para gerir os arquivos de upload e download
	const [ficheiro, setFicheiro] = useState(null);
	const [nomeFicheiro, setNomeFicheiro] = useState("");
	const [erro, setErro] = useState("");
	const [uploading, setUploading] = useState(false);
	const [publicURL, setPublicURL] = useState("");
	const [documento, setDocumento] = useState(null);

	// Função de validação separada para reutilização
	const validateFile = (file) => {
		if (file.type !== "application/pdf") {
			return "Apenas ficheiros PDF são permitidos!";
		}

		if (file.size > 50000000) {
			return "Tamanho máximo: 50MB";
		}
		
		return null;
	};

	// Função chamada quando um user seleciona o ficheiros através de um <input type="file">
	const handleFileChange = async (e) => {
		
		const file = e.target.files[0];

		if (!file) return

		const validationError = validateFile(file);
		if (validationError) {
			setErro(validationError);
			return;
		}
		
		setFicheiro(file);
		setNomeFicheiro(file.name);
		setDocumento(file);
		setErro("");
		// Limpa o valor do input para permitir nova seleção do mesmo ficheiro
		e.target.value = null;
	};

	// Função que lida com o arrastar e soltar o ficheiro
	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const file = e.dataTransfer.files[0];

		if (!file) return;

		const validationError = validateFile(file);
		if (validationError) {
		  setErro(validationError);
		  return;
		}

		setFicheiro(file);
		setNomeFicheiro(file.name);
		setErro("");
	};

	// Função para obter o ID do utilizador atual
	const getCurrentUserId = async () => {
		const { data: {user}, error } = await supabase.auth.getUser();
		if (error) throw error;
		return user.id;
	};

	// Função chamada quando o formulário é submetido
	const handleSubmit = async (e) => {
		e.preventDefault();
	
		if (!ficheiro) {
			setErro("Nenhum ficheiro selecionado!");
			return;
		}
	
		try {
			setUploading(true);
			setErro("");
	
			// Obter o utilizador atual
			const { data: { user }, error: userError } = await supabase.auth.getUser();
			if (userError || !user) throw new Error("Não foi possível obter o utilizador.");
	
			const user_id = user.id;
	
			// Buscar id_tipo_user do utilizador
			const { data: userDetails, error: userDetailsError } = await supabase
				.from("user_details")
				.select("id_tipo_user, nome")
				.eq("id_user", user_id)
				.single();
	
			if (userDetailsError || !userDetails) throw new Error("Erro ao obter detalhes do utilizador.");
	
			// Buscar o tipo_user pelo id_tipo_user
			const { data: tipoUserData, error: tipoUserError } = await supabase
				.from("tipo_user")
				.select("tipo_user")
				.eq("id", userDetails.id_tipo_user)
				.single();
	
			if (tipoUserError || !tipoUserData) throw new Error("Erro ao verificar o tipo de utilizador.");
	
			// Verificar se é aluno
			if (tipoUserData.tipo_user !== "aluno") {
				setErro("Apenas utilizadores do tipo 'aluno' podem submeter documentos.");
				setUploading(false);
				return;
			}
	
			// Fazer upload para o Supabase Storage
			const { data: storageData, error: storageError } = await supabase.storage
				.from("documentos")
				.upload(ficheiro.name, ficheiro, {
					cacheControl: "3600",
					upsert: false,
					contentType: ficheiro.type,
				});
	
			if (storageError) throw storageError;
	
			const { data: { publicURL } } = supabase.storage
				.from("documentos")
				.getPublicUrl(storageData.path);
	
			setPublicURL(publicURL);
	
			// Inserir metadados na tabela user_documents
			const sendDocumentData = {
				user_id: user_id,
				document_id: storageData.id,
				created_at: new Date(),
				name: ficheiro.name,
				author: userDetails.nome,
				size: ficheiro.size,
				estado: 1,
			};
	
			const { error: dbError } = await supabase
				.from("user_documents")
				.insert([sendDocumentData]);
	
			if (dbError) throw dbError;

            // --- INSERIR NOTIFICAÇÃO ---
            const notificationMessage = `O documento "${ficheiro.name}" foi submetido com sucesso.`;

			// Função para buscar o ID do tipo de notificação pela descrição
    		const getNotificationTypeId = async (descricao) => {
        		const { data, error } = await supabase
            		.from('notification_type') // Nome da sua tabela de tipos de notificação
            		.select('id_tipo_notificacao')
            		.eq('descricao', descricao)
            		.single();

				if (error) {
					console.error(`Erro ao buscar o ID do tipo de notificação para "${descricao}":`, error);
					throw new Error(`Não foi possível encontrar o tipo de notificação para "${descricao}".`);
				}

				if (!data) {
					throw new Error(`Tipo de notificação "${descricao}" não encontrado.`);
				}

				return data.id_tipo_notificacao;
			};

			// Função para buscar o ID do estado da notificação pela descrição
			const getNotificationStateId = async (estado) => {
				const { data, error } = await supabase
					.from('notification_state')
					.select('id_estado')
					.eq('estado', estado)
					.single();

				if (error) {
					console.error(`Erro ao buscar o ID do estado da notificação para "${estado}":`, error);
					throw new Error(`Não foi possível encontrar o estado de notificação para "${estado}".`);
				}

				if (!data) {
					throw new Error(`Estado de notificação "${estado}" não encontrado.`);
				}

				return data.id_estado;
			};


			const tipoNotificacaoId = await getNotificationTypeId('doc_submetido'); // Buscar o UUID para 'doc_submetido'
            const estadoNotificacaoId = await getNotificationStateId('nao_lida'); // Buscar o ID do estado da notificação dinamicamente

            const notificationData = {
                id_user: user_id,
                created_at: new Date().toISOString(),
                id_tipo_notification: tipoNotificacaoId, 
                id_estado: estadoNotificacaoId, // **IMPORTANT**: Replace with the actual UUID for the initial state (e.g., unread) from your estado table
                mensagem: notificationMessage,
            };

            const { error: notificationError } = await supabase
                .from("user_notifications") // **IMPORTANT**: Replace with your actual notifications table name if different
                .insert([notificationData]);

            if (notificationError) {
                console.error("Erro ao criar notificação:", notificationError);
            }
            // --- FIM INSERIR NOTIFICAÇÃO ---
	
			alert("Ficheiro submetido com sucesso!");
	
		} catch (error) {
			setErro("Erro: " + error.message);
		} finally {
			setUploading(false);
		}
	};
	
	






	return (
		<>
			<div>
				<HeaderInicio />
			</div>
			
			{/* Área principal de upload (pasta) */}
			{/*ALTEREI ESTA DIV PARA TER MT-15*/}
			<div className="h-[calc(100vh-80px)] flex items-center justify-center bg-gray-200"> 

				<form onSubmit={handleSubmit}>
					{/* Retângulo pequeno superior */}
					{/*ALTEREI ESTA DIV PARA TER w-[25vw]*/}
					<div className="bg-[#012B55] text-white p-6  flex flex-col  rounded-tr-[50px] rounded-tl-4xl sm:w-[25vw] md:w-[25vw] ]">
					</div>

					{/* Retângulo grande inferior */}
					{/*ALTEREI ESTA DIV PARA TER w-[50vw]*/}
					<div className="w-[50vw] h-[50vh] bg-[#012B55] text-white  rounded-tr-4xl rounded-br-4xl flex flex-col items-center justify-center text-center rounded-bl-4xl"
						onDragOver={(e) => e.preventDefault()}
						onDrop={handleDrop}
					>
					
						{/* Exibição de Erros */}
						{erro && (
							<div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg mb-1">
								{erro}
							</div>
						)}	
						
						{/*ALTEREI ESTA DIV PARA TER MT-10*/}
						{/* Informações para o utilizador */}
						<p className="font-semibold text-2xl ">Para submeter, pode arrastar os ficheiros</p>
						<span className="my-2 text-2xl">ou</span>
						
						{/* Botão para selecionar o ficheiro */}
						<label className="cursor-pointer bg-[#0369A9] hover:bg-[#0A3C5C] px-4 py-2 rounded-full flex items-center gap-2 text-2xl">
							<Search size={18} />
							Procurar nos Ficheiros
							<input type="file" multiple className="hidden" onChange={handleFileChange} accept=".pdf,application/pdf" />
						</label>

						{/* Mostrar o nome do ficheiro selecionado */}
						<div className="my-10">
							{nomeFicheiro && (
								<p>Ficheiro selecionado: <strong>{nomeFicheiro}</strong></p>
							)}
						</div>
						
						{/* Botão de submissão (só aparece se um arquivo for selecionado) */}
						{documento && (
							<button onClick={handleSubmit} disabled={uploading || !ficheiro} className="mb-20 bg-green-600 hover:bg-green-800 px-6 py-2 rounded-full flex items-center gap-2 text-white text-2xl">
								{uploading ? 'A processar...' : 'Submeter'} <Upload size={18} />
							</button>
						)}

					</div>
				</form>
			</div>	

		</>
	);
}