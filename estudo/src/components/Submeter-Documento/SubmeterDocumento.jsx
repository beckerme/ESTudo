'use client';
// Imports relacionados com páginas e fontes
import { Kanit } from "next/font/google";
import HeaderInicio from "../HeaderInicio";
import { useState } from 'react';
import { Upload, Search } from 'lucide-react';

// Fonte
const kanit = Kanit({
	subsets: ['latin'],
	weight: "400",
});

export default function SubmeterDocumento() {
	const [files, setFiles] = useState([]);

	const handleFileChange = (event) => {
		setFiles([...event.target.files]);
	};

	const handleDrop = (event) => {
		event.preventDefault();
		setFiles([...event.dataTransfer.files]);
	};

	return (
		<>
			<div>
				<HeaderInicio />
			</div>

			{/* div 2 retangulos */}
			<div class="flex justify-center items-center min-h-screen bg-gray-200 p-5 flex flex-col">

				{/* Retângulo pequeno */}
				<div className=" w-full max-w-xs bg-blue-900 text-white p-6  flex flex-col mr-144 rounded-tr-4xl rounded-tl-4xl">
				</div>

				{/* Retângulo grande */}
				<div className="w-full max-w-4xl bg-blue-900 text-white p-6 rounded-tr-4xl rounded-br-4xl flex flex-col items-center justify-center text-center rounded-bl-4xl"
					onDragOver={(e) => e.preventDefault()}
					onDrop={handleDrop}
				>
					<p className="font-semibold">Para submeter, podes arrastar os ficheiros!</p>
					<span className="my-2">ou</span>
					<label className="cursor-pointer bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2">
						<Search size={18} />
						Procurar nos Ficheiros
						<input type="file" multiple className="hidden" onChange={handleFileChange} />
					</label>
					<button className="mt-4 bg-green-600 px-6 py-2 rounded-lg flex items-center gap-2 text-white">
						Submeter <Upload size={18} />
					</button>
				</div>

			</div>


		</>
	);
}
