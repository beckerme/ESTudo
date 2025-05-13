import Image from "next/image";
import { useState } from "react";
import Notificacao from "@/components/Notificacao"; // Notificações

export default function HeaderInicio() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);

  return (
    <>
      <header>
        <div className="w-full h-[80px] bg-white flex items-center justify-between px-10 rounded-bl-[40px] rounded-br-[40px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
          
          {/* Ícone de Perfil */}
          <div className="w-12 h-12 flex items-center justify-center cursor-pointer" onClick={() => setIsProfileSidebarOpen(true)}>
            <Image src="/user.png" width={80} height={80} alt="foto do utilizador" />
          </div>

          {/* Logo Central */}
          <div className="w-12 h-12">
            <a href="pag-inicial-aluno">
              <Image src="/logo.png" width={80} height={80} alt="logotipo aplicação" />
            </a>
          </div>

          {/* Ícones à Direita */}
          <div className="flex items-center gap-4">
            
            {/* Ícone de Notificação */}
            <div className="relative cursor-pointer" onClick={() => setIsNotificationOpen(true)}>
              <Image src="/notification.png" width={30} height={30} alt="sino de notificações" />
            </div>

            {/* Bandeira de Portugal */}
            <div className="flex w-8 h-12 items-center rounded-md overflow-hidden">
              <Image src="/bandeira_portugal.png" width={100} height={100} alt="bandeira de Portugal" />
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar do Perfil */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 p-6 transform transition-all duration-500 ease-in-out ${
          isProfileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-80`} // aumentei o width para 80 (320px)
      >
        {/* Botão de Fechar */}
        <button 
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl cursor-pointer"
          onClick={() => setIsProfileSidebarOpen(false)}
        >
          &times;
        </button>

        <div className="flex flex-col items-center mt-10">
          <Image src="/user.png" width={100} height={100} alt="foto do utilizador" className="rounded-full mb-6" />
          <h2 className="text-xl font-bold mb-6">Menu do Perfil</h2>
          <ul className="space-y-4 text-center">
            <li><a href="#" className="hover:underline">Meu Perfil</a></li>
            <li><a href="submeter-doc" className="hover:underline">Submeter Documentos</a></li>
            <li><a href="#" className="hover:underline">Definições</a></li>
            <li><a href="login" className="hover:underline">Sair</a></li>
            
          </ul>
        </div>
      </div>

      {/* Overlay */}
      {isProfileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => setIsProfileSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar de Notificações */}
      <Notificacao isOpen={isNotificationOpen} setIsOpen={setIsNotificationOpen} />
    </>
  );
}
