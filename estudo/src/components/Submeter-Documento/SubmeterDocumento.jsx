'use client';
// Imports relacionados com páginas e fontes
import { Kanit } from "next/font/google";
import HeaderInicio from "../HeaderInicio";
import { use, useState } from 'react';
import { Upload, Search } from 'lucide-react';
import supabase from "@/app/config/supabaseClient";



// Fonte
const kanit = Kanit({
	subsets: ['latin'],
	weight: "400",
});

export default function SubmeterDocumento() {

	// Variáveis relacionadas com os ficheiros
	const [ficheiro, setFicheiro] = useState([]);
	const [nomeFicheiro, setNomeFicheiro] = useState("");
	const [erro, setErro] = useState("");
	const [uploading, setUploading] = useState(false);
	const [publicURL, setPublicURL] = useState("");
	const [documento, setDocumento] = useState(null);

	const onFileSelect = (event) => {
		setDocumento(event.target.files[0]); // Guarda o arquivo no estado
	  };

	// Função chamada quando um user seleciona o ficheiros através de um <input type="file">
	// A linha 23 converte a lista de ficheiros num array normal
	const handleFileChange = async (e) => {
		
		const file = e.target.files[0];

		if (file) {
			setFicheiro(file);
			setNomeFicheiro(file.name);
			setDocumento(file);
		}

		// Limpa o valor do input para permitir nova seleção do mesmo ficheiro
		e.target.value = null;
	};

	// Função que lida com o arrastar e soltar o ficheiro
	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();

		const file = e.dataTransfer.files[0];

		if (file) {
			setFicheiro(file);
			setNomeFicheiro(file.name);
			setDocumento(file);
		}

		// Limpa o valor do input para permitir nova seleção do mesmo ficheiro
		e.target.value = null;
	};

	// Função chamada quando o formulário é submetido
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Verifica se o array está vazio (nenhum ficheiro foi selecionado) Verifica se o tipo é PDF, se está vazio ou não é .pdf exibe uma mensagem de erro
		if (!ficheiro || ficheiro.type !== "application/pdf") {
			setErro("Apenas ficheiros PDF são permitidos!");
			return
		}

		// Verifica se o tamanho máximo são 50 MB
		if (ficheiro.size > 50000000) {
			setErro("Tamanho máximo: 50MB");
		}

		try {	
			setUploading(true);
			setErro("");

			// Fazer o Upload para o Supabase Storage
			const { data, error } = await supabase.storage
			.from('documentos')
			.upload(ficheiro.name, ficheiro, {
				cacheControl: '3600',
				upsert: false,
				contentType: ficheiro.type,
			});

			

			// Caso de erro
			if (error) throw error;

			// Caso de sucesso
				// URL público 
				const {data: {publicURL}} = supabase.storage
				.from('documentos')
				.getPublicUrl(data.path)

				setPublicURL(publicURL)
				alert("Ficheiro submetido com sucesso!")

		} catch (error) {
			setErro("Erro: " + error.message);
		} finally {
			setUploading(false)
		}
	}

	return (
		<>
			<div>
				<HeaderInicio />
			</div>

			

			{/* div 2 retangulos */}
			<div className="justify-center items-center  bg-gray-200 p-30 flex flex-col">
			
			<form onSubmit={handleSubmit}>
				{/* Retângulo pequeno */}
				<div className=" w-[34vw] h-[1vh] bg-blue-900 text-white p-6  flex flex-col mr-127	 rounded-tr-4xl rounded-tl-4xl">
				</div>

				{/* Retângulo grande */}
				<div className="w-[67vw] h-[50vh] bg-blue-900 text-white p-6 rounded-tr-4xl rounded-br-4xl flex flex-col items-center justify-center text-center rounded-bl-4xl"
					onDragOver={(e) => e.preventDefault()}
					onDrop={handleDrop}
				>
				
				{erro && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg mb-20">
						{erro}
					</div>
          		)}
					<p className="font-semibold text-2xl">Para submeter, podes arrastar os ficheiros!</p>
					<span className="my-2 text-2xl">ou</span>
					<label className="cursor-pointer bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 text-2xl">
						<Search size={18} />
						Procurar nos Ficheiros
						<input type="file" multiple className="hidden" onChange={handleFileChange} accept=".pdf,application/pdf" />
					</label>
					
					
					{/* Botão só aparece se um arquivo for selecionado */}
					{documento && (
        <button onClick={handleSubmit} disabled={uploading || !ficheiro} className="mt-4 bg-green-600 hover:bg-green-800 px-6 py-2 rounded-lg flex items-center gap-2 text-white text-2xl">
		{uploading ? 'A processar...' : 'Submeter'} <Upload size={18} />
	</button>
      )}




					{/* Mostrar o nome do ficheiro selecionado */}
					<div className="my-10">
						{nomeFicheiro && (
							<p>Ficheiro selecionado: <strong>{nomeFicheiro}</strong></p>
						)}
					</div>
					

				</div>
				</form>
			</div>
			

		</>
	);
}
