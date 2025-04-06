import Image from "next/image";
import HeaderInicio from "./HeaderInicio";
import { Kanit } from "next/font/google";

// Font
const kanit = Kanit({
    subsets: ['latin'],
    weight: ["400","700","800"],
});

export default function ApontamentosPOO() {
  return (
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
                                <span className="text-5xl md:text-6xl text-white">DOCUMENTO</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Div Comentário e Avaliação */}
                    <div className="bg-[#012B55] rounded-xl shadow-lg overflow-hidden flex flex-col px-5">

                        {/* Avaliação */}
                        <div className="pt-10 pb-20 text-center">
                            <div className="flex justify-center items-center">
                                <span className="text-white text-4xl font-bold">4,5/5</span>
                                <Image src="/star.png" width={30} height={30} alt="estrela" className="w-8 h-8 ml-2"/>
                            </div>
                            <div className="flex justify-center mt-2">
                                <Image src="/5_stars.png" width={200} height={40} alt="rating de 4,5 estrelas" className="h-8" />
                            </div>
                        </div>
                        
                        {/* Div Comentário */}
                        <div>
                            <div className="flex-grow overflow-y-auto px-4 py-2">
                                {/* USER 1 */}
                                <div className="mb-10">
                                    <div className="flex items-center">
                                        <Image src="/user.png" width={30} height={30} alt="foto de perfil utilizador" className="w-8 h-8"/>
                                        <span className="ml-2 text-xl text-white">Antonio123</span>
                                    </div>
                                    <div className="mt-2 bg-[#0369A9] rounded-3xl p-4 text-white">
                                        <p className="text-lg">Explica muito bem o tema!</p>
                                        <div className="flex justify-end mt-2">
                                            <button className="mr-3">
                                                <Image src="/thumbs_down.png" alt="dislike" width={30} height={30} className="w-6 h-6" />
                                            </button>
                                            <button>
                                                <Image src="/thumbs_up.png" alt="like" width={30} height={30} className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* USER 2 */}
                                <div className="mb-4">
                                    <div className="flex items-center">
                                        <Image src="/user.png" width={30} height={30} alt="foto de perfil utilizador" className="w-8 h-8"/>
                                        <span className="ml-2 text-xl text-white">Joao456</span>
                                    </div>
                                    <div className="mt-2 bg-[#0369A9] rounded-3xl p-4 text-white">
                                        <p className="text-lg">Não gostei muito!</p>
                                        <div className="flex justify-end mt-2">
                                            <button className="mr-3">
                                                <Image src="/thumbs_down.png" alt="dislike" width={30} height={30} className="w-6 h-6" />
                                            </button>
                                            <button>
                                                <Image src="/thumbs_up.png" alt="like" width={30} height={30} className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Adicionar Comentário */}
                            <div className="flex flex-col sm:flex-row 2xl:items-end sm:items-center h-auto sm:h-[22vh] py-2 xl:py-0 space-y-2 sm:space-y-0 sm:space-x-2">
                                <div className="flex-grow bg-white text-black rounded-full py-2 px-4 shadow-md">
                                    <form className="w-full">
                                        <input 
                                            type="text" 
                                            placeholder="Adicione um Comentário"
                                            className="w-full bg-transparent outline-none text-sm sm:text-base"
                                        />
                                    </form>
                                </div>
                                <div className="flex justify-end sm:justify-center">
                                    <button className="p-1 hover:scale-110 transition-transform">
                                        <Image src="/send.png" width={40} height={40} alt="enviar"/>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
}