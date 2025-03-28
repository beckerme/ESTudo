import { Kanit } from "next/font/google";
const kanit = Kanit({
  subsets: ["latin"],
  weight: "400",
});

import Header from "../Login/Header";

export default function RegisterPage() {
  return (

  <div>
    <div className={`${kanit.className} min-h-screen flex justify-center items-center p-4`}>
      <div className="w-full max-w-6xl flex flex-col lg:flex-row p-8 rounded-3xl gap-8">
        
        {/* Left Section */}
        <div className={`${kanit.className} w-full lg:w-2/3 flex items-center justify-center bg-[#012B55] rounded-3xl p-8`}>
          <div className="text-center text-white">
            <p className="text-3xl md:text-5xl lg:text-6xl font-bold">Bem vindo à ESTudo!</p>
            <p className="text-lg md:text-xl mt-4">Uma aplicação de partilha de documentos inovadora!</p>
          </div>
        </div>

        {/* Right Section */}
        <div className={`${kanit.className} w-full lg:w-1/3 bg-cyan-500 p-8 rounded-3xl flex flex-col`}>
          <h1 className="text-xl font-bold text-black mb-4 text-center">Registo</h1>
          <div className="flex justify-center items-center mb-4">
          </div>
          <form className="flex flex-col space-y-2">
            <input className="p-3 rounded border bg-white w-full" type="text" placeholder="Nome" />
            <div className="flex items-center border rounded p-3 bg-white">
              <input className="flex-1 outline-none bg-white" type="text" placeholder="Email" />
            </div>
            <input className="p-3 rounded border bg-white w-full" type="password" placeholder="Password" />
            <input className="p-3 rounded border bg-white w-full" type="password" placeholder="Confirme a sua password" />
            <input className="p-3 rounded border bg-white w-full" type="text" placeholder="Curso" />
            <button className="mt-4 bg-blue-900 text-white py-3 rounded hover:bg-blue-800">Registar</button>
          </form>
          <div className="flex justify-center">
              <div className="w-2/3 text-center mt-5">
                <p className="text-xl">Se já tem uma conta, faça login<a href="/login" 
                   className="text-white underline hover:text-blue-800 ml-1 font-medium">aqui</a>!
                </p>
              </div>
          </div> 
        </div>
      </div>
    </div>

  </div>
  );
}
