"use client";

// 🛠️ Imports necessários para o componente principal
import { useEffect, useState } from "react";                      // 🎣 Hooks padrão do React para gerir estado e efeitos colaterais
import { useRouter } from 'next/navigation';                      // 🚀 Hook do Next.js para navegação programática
import HeaderInicioAluno from "@/components/HeaderInicioAluno";   // ⬆️ Cabeçalho para Aluno
import HeaderInicioMod from "@/components/HeaderInicioMod";       // ⬆️ Cabeçalho para Mod
import HeaderInicioAdmin from "@/components/HeaderInicioAdmin";   // ⬆️ Cabeçalho para Admin


// 🏡 Componente principal da página (Homepage/Página Inicial)
export default function App() {
    const router = useRouter();                                     // 🚀 Hook para permitir navegação no Next.js
    const [autorizado, setAutorizado] = useState(null); 
    const [tipoUtilizador, setTipoUtilizador] = useState(null);


    // 🕵️‍♂️ Efeito para carregar o tipo de utilizador do localStorage e procurar as tags na montagem
    useEffect(() => {
        const tipo = localStorage.getItem("tipoUsuario");

        if (tipo === "user_inativo" || tipo === 'user_nao_validado') {
          setAutorizado(false);
          router.push("/mensagem-erro");
        } else {
          setAutorizado(true);
          setTipoUtilizador(tipo);
        }
      }, [router]);

      if (autorizado === null) {
        return null; 
      }

      if (!autorizado) {
        return null; 
      }

  // 🏗️ Estrutura de renderização da página inicial
  return (
    // 📦 Container principal da página
    <div className="min-h-[calc(100vh-80px)] flex flex-col">
      {/* ⬆️ Renderiza o cabeçalho correto */}
      {tipoUtilizador === "aluno" && <HeaderInicioAluno />}
      {tipoUtilizador === "mod" && <HeaderInicioMod />}
      {tipoUtilizador === "admin" && <HeaderInicioAdmin />}
      {/* Se tipoUsuario for algo inesperado, nenhum cabeçalho específico será mostrado. */}

      {/* 🖥️ Área de conteúdo principal da página, centralizada */}
      <div className="flex flex-col items-center w-full px-4 py-6 my-auto">
        {/* 📄 Títulos principais da página */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ESTudo</h1> 
          <p className="text-lg text-gray-700 mt-2">University Document-Sharing App</p>
        </div>

        {/* 🔘 Botões de ação principais */}
        <div className="flex gap-15">
          {tipoUtilizador === "aluno" && (
            <>
              {/* 🔍 Botão Pesquisar Apontamentos */}
              <button
                onClick={() => router.push('/pesquisa')}
                className="flex flex-col items-center justify-center w-70 h-40 bg-gray-300 hover:bg-gray-400 rounded-lg transition-colors duration-200"
              >
                <div className="text-4xl mb-2">🔍</div>
                <span className="text-gray-800 font-medium text-center">
                  Realizar<br />Pesquisa
                </span>
              </button>

              {/* 📤 Botão Submeter Apontamentos */}
              <button
                onClick={() => router.push('/submeter-doc')}
                className="flex flex-col items-center justify-center w-70 h-40 bg-gray-300 hover:bg-gray-400 rounded-lg transition-colors duration-200"
              >
                <div className="text-4xl mb-2">📤</div>
                <span className="text-gray-800 font-medium text-center">
                  Submeter<br />Documentos
                </span>
              </button>
            </>
          )}

          {tipoUtilizador === "mod" && (
            <>
              {/* ✅ Botão Aprovar Apontamentos */}
              <button
                onClick={() => router.push('/validar-documento')}
                className="flex flex-col items-center justify-center w-70 h-40 bg-gray-300 hover:bg-gray-400 rounded-lg transition-colors duration-200"
              >
                <div className="text-4xl mb-2">✅</div>
                <span className="text-gray-800 font-medium text-center">
                  Validar<br />Documentos
                </span>
              </button>

              {/* 🔍 Botão Realizar Pesquisa */}
              <button
                onClick={() => router.push('/pesquisa')}
                className="flex flex-col items-center justify-center w-70 h-40 bg-gray-300 hover:bg-gray-400 rounded-lg transition-colors duration-200"
              >
                <div className="text-4xl mb-2">🔍</div>
                <span className="text-gray-800 font-medium text-center">
                  Realizar<br />Pesquisa
                </span>
              </button>
            </>
          )}

          {tipoUtilizador === "admin" && (
            <>
              {/* 👤 Botão Aprovar Registos */}
              <button
                onClick={() => router.push('/validar-registo')}
                className="flex flex-col items-center justify-center w-70 h-40 bg-gray-300 hover:bg-gray-400 rounded-lg transition-colors duration-200"
              >
                <div className="text-4xl mb-2">👤</div>
                <span className="text-gray-800 font-medium text-center">
                  Aprovar<br />Registos
                </span>
              </button>

              {/* 📊 Botão Visualizar Estatísticas */}
              <button
                onClick={() => router.push('/estatisticas')}
                className="flex flex-col items-center justify-center w-70 h-40 bg-gray-300 hover:bg-gray-400 rounded-lg transition-colors duration-200"
              >
                <div className="text-4xl mb-2">📊</div>
                <span className="text-gray-800 font-medium text-center">
                  Visualizar<br />Estatísticas
                </span>
              </button>

              {/* 🗑️ Botão Apagar Conta */}
              <button
                onClick={() => router.push('/apagar-conta')}
                className="flex flex-col items-center justify-center w-70 h-40 bg-gray-300 hover:bg-gray-400 rounded-lg transition-colors duration-200"
              >
                <div className="text-4xl mb-2">🗑️</div>
                <span className="text-gray-800 font-medium text-center">
                  Apagar<br />Conta
                </span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}