"use client"

import Image from "next/image";
import { useState } from "react";
import Notificacao from "@/components/Notificacao"; // Notificações

export default function HeaderInicio() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    window.location.href = "/login"; // Ou use router.push se preferir
  };

  return (
    <>
      <header>
        <div className="w-full h-[80px] bg-white flex items-center justify-between px-10 rounded-bl-[40px] rounded-br-[40px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
          
          {/* Ícone de Perfil */}
          <div
            className="w-12 h-12 flex items-center justify-center cursor-pointer"
            onClick={() => setIsProfileSidebarOpen(true)}
          >
            <Image src="/user.png" width={80} height={80} alt="foto do utilizador" />
          </div>

          {/* Logo Central */}
          <div className="w-12 h-12">
            <a href="pag-inicial">
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
        } w-80`}
        style={{
          pointerEvents: isLogoutModalOpen ? "none" : "auto",
          userSelect: isLogoutModalOpen ? "none" : "auto",
        }}
      >
        {/* Botão de Fechar */}
        <button 
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl cursor-pointer"
          onClick={() => !isLogoutModalOpen && setIsProfileSidebarOpen(false)}
          disabled={isLogoutModalOpen}
        >
          &times;
        </button>

        <div className="flex flex-col items-center mt-10">
          <Image src="/user.png" width={100} height={100} alt="foto do utilizador" className="rounded-full mb-6" />
          <h2 className="text-xl font-bold mb-6">Menu do Perfil</h2>
          <ul className="space-y-4 text-center">
            <li>
              <a
                href="submeter-doc"
                className={`hover:underline ${isLogoutModalOpen ? "pointer-events-none opacity-50" : ""}`}
              >
                Submeter Documentos
              </a>
            </li>
            <li>
              <button
                onClick={() => !isLogoutModalOpen && setIsLogoutModalOpen(true)}
                className={`hover:underline text-red-600 ${isLogoutModalOpen ? "pointer-events-none opacity-50" : ""}`}
                disabled={isLogoutModalOpen}
              >
                Sair
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay da Sidebar */}
      {isProfileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => !isLogoutModalOpen && setIsProfileSidebarOpen(false)}
        ></div>
      )}

      {/* PopUp de Logout */}
      {isLogoutModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-50 z-60"
            onClick={() => setIsLogoutModalOpen(false)}
          ></div>

          <div className="fixed inset-0 z-70 flex items-center justify-center pointer-events-none">
            <div className="relative z-70 bg-white rounded-xl shadow-lg p-8 w-[90%] max-w-md text-center pointer-events-auto">
              <h3 className="text-xl font-semibold mb-4">Tem a certeza que deseja sair?</h3>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setIsLogoutModalOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={handleLogout}
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Sidebar de Notificações */}
      <Notificacao isOpen={isNotificationOpen} setIsOpen={setIsNotificationOpen} />
    </>
  );
}
