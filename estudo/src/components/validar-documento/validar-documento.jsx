"use client";

import { Kanit } from "next/font/google";
import Header from "../HeaderInicio";
import { useState, useEffect } from 'react';
import { Search, XCircle, CheckCircle } from 'lucide-react';
import supabase from "@/app/config/supabaseClient";

// Fonte
const kanit = Kanit({
  subsets: ['latin'],
  weight: "400",
});

export default function ValidarDocumento() {
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState([]);

  // Mapeamento de estados
  const ESTADOS = {
    por_aprovar: 1,
    publicado: 2,
    nao_aprovado: 3,
  };

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('user_documents')
      .select(`id, name, author, estado`)
      .in('estado', [ESTADOS.por_aprovar, ESTADOS.publicado]); // Buscar por aprovar e publicados

    if (error) {
      console.error("Erro ao buscar documentos:", error.message);
    } else {
      setDocuments(data);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Atualiza o estado do documento
  const updateEstado = async (id, novoEstado) => {
    const { error } = await supabase
      .from('user_documents')
      .update({ estado: novoEstado })
      .eq('id', id);

    if (error) {
      console.error("Erro ao atualizar estado:", error.message);
    } else {
      // Atualiza lista local após ação
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    }
  };

  const getEstadoLabel = (estado) => {
    switch (estado) {
      case ESTADOS.por_aprovar:
        return "Por Aprovar";
      case ESTADOS.publicado:
        return "Publicado";
      default:
        return "Desconhecido";
    }
  };

  return (
    <>
      <div>
        <Header />
      </div>

      {/* Caixa de Pesquisa */}
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-4xl bg-blue-900 p-6 rounded-xl shadow-lg">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Pesquisa"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 pl-4 rounded-lg bg-green-500 text-white placeholder-white focus:outline-none"
            />
            <Search className="absolute right-3 top-3 text-white" />
          </div>

          {/* Lista com scroll */}
          <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
            {documents
              .filter((doc) =>
                doc.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((doc, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center justify-between bg-blue-600 p-4 rounded-lg shadow-md"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-12 h-12 rounded-full bg-white"></div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-white font-bold">{doc.name}</h3>
                      <p className="text-gray-300 text-sm">{doc.author}</p>
                      <p className="text-gray-400 text-xs">
                        Estado: {getEstadoLabel(doc.estado)}
                      </p>
                    </div>
                  </div>

                  {/* Botões só aparecem se o documento estiver por aprovar */}
                  {doc.estado === ESTADOS.por_aprovar && (
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <XCircle
                        className="text-red-500 cursor-pointer"
                        size={24}
                        onClick={() => updateEstado(doc.id, ESTADOS.nao_aprovado)}
                      />
                      <CheckCircle
                        className="text-green-500 cursor-pointer"
                        size={24}
                        onClick={() => updateEstado(doc.id, ESTADOS.publicado)}
                      />
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
