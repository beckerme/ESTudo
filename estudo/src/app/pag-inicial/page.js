"use client";

import { useEffect, useState } from "react";
import HeaderInicioAdmin from "@/components/HeaderInicioAdmin";
import HeaderInicioMod from "@/components/HeaderInicioMod";
import HeaderInicioAluno from "@/components/HeaderInicioAluno";
import ListaDocumentos from "@/components/ListaDocumentos";
import BarraPesquisa from "@/components/BarraPesquisa";

export default function PagInicial() {
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [termoPesquisa, setTermoPesquisa] = useState("");

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");
    setTipoUsuario(tipo);
  }, []);

  if (!tipoUsuario) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Cabeçalho por tipo de usuário */}
      {tipoUsuario === "admin" && <HeaderInicioAdmin />}
      {tipoUsuario === "mod" && <HeaderInicioMod />}
      {tipoUsuario === "aluno" && <HeaderInicioAluno />}

      {/* Conteúdo principal */}
      <div className="flex flex-col items-center w-full px-4 py-6">
        {/* Título */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">ESTudo</h1>
          <p className="text-lg text-gray-700 mt-2">University Document-Sharing App</p>
        </div>

        {/* Barra de Pesquisa com tamanho antigo */}
        <div className="mt-6">
          <BarraPesquisa
            type="search"
            onChange={(e) => setTermoPesquisa(e.target.value)}
          />
        </div>

        {/* Lista de documentos */}
        <div className="w-full mt-10 flex justify-center">
          <div className="w-full max-w-4xl px-4">
            <ListaDocumentos termoPesquisa={termoPesquisa} />
          </div>
        </div>
      </div>
    </div>
  );
}
