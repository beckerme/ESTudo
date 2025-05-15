"use client";
import { useEffect, useState } from "react";
import HeaderInicioAdmin from "@/components/HeaderInicioAdmin";
import HeaderInicioMod from "@/components/HeaderInicioMod";
import HeaderInicioAluno from "@/components/HeaderInicioAluno";
import ListaDocumentos from "@/components/ListaDocumentos";
import BarraPesquisa from "@/components/BarraPesquisa";

export default function PagInicial() {
  const [tipoUsuario, setTipoUsuario] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tipo = localStorage.getItem("tipoUsuario");
      setTipoUsuario(tipo);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header diferente para cada tipo */}
      {tipoUsuario === "admin" && <HeaderInicioAdmin />}
      {tipoUsuario === "mod" && <HeaderInicioMod />}
      {tipoUsuario === "aluno" && <HeaderInicioAluno />}

      {/* Conteúdo comum */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">ESTudo</h1>
          <p className="text-lg text-gray-700 mt-2">University Document-Sharing App</p>
        </div>
        <div className="mt-6">
          <BarraPesquisa type="search" className="px-4 py-2 border rounded-md" />
        </div>
      </div>

      <div className="py-6">
        <ListaDocumentos />
      </div>
    </div>
  );
}
