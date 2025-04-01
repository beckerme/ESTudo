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

			<div>
				<div className="flex justify-center items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="currentColor"
						className="w-12 h-12 text-blue-600"
					>
						<path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 14.93V11h-2v5.93a8.001 8.001 0 01-3.95-1.57l1.42-1.42A6.001 6.001 0 0012 18a6.001 6.001 0 003.53-1.06l1.42 1.42A8.001 8.001 0 0113 16.93zM12 4a8 8 0 00-5.66 13.66l1.42-1.42A6 6 0 0112 6a6 6 0 014.24 1.76l1.42-1.42A8 8 0 0012 4z" />
					</svg>
				</div>
			</div>

			{/* div 2 retangulos */}
			<div className="flex justify-center items-center  bg-gray-200 p-30 flex flex-col">

				{/* Retângulo pequeno */}
				<div className=" w-[34vw] h-[1vh] bg-blue-900 text-white p-6  flex flex-col mr-127	 rounded-tr-4xl rounded-tl-4xl">
				</div>

				{/* Retângulo grande */}
				<div className="w-[67vw] h-[50vh] bg-blue-900 text-white p-6 rounded-tr-4xl rounded-br-4xl flex flex-col items-center justify-center text-center rounded-bl-4xl"
					onDragOver={(e) => e.preventDefault()}
					onDrop={handleDrop}
				>
					<p className="font-semibold text-2xl">Para submeter, podes arrastar os ficheiros!</p>
					<span className="my-2 text-2xl">ou</span>
					<label className="cursor-pointer bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 text-2xl">
						<Search size={18} />
						Procurar nos Ficheiros
						<input type="file" multiple className="hidden" onChange={handleFileChange} />
					</label>
					<button className="mt-4 bg-green-600 px-6 py-2 rounded-lg flex items-center gap-2 text-white text-2xl">
						Submeter <Upload size={18} />
					</button>
				</div>

			</div>


		</>
	);
}
