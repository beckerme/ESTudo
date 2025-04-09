"use client";

import { Kanit } from "next/font/google";
import Header from "../HeaderInicio";
import { useState, useEffect } from 'react';
import { Search, XCircle, CheckCircle } from 'lucide-react';
import supabase from "@/app/config/supabaseClient";

const kanit = Kanit({ subsets: ['latin'], weight: "400" });

export default function ValidarDocumento() {
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState([]);
  const [tags, setTags] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [selectedTagId, setSelectedTagId] = useState(null);

  const ESTADOS = {
    por_aprovar: 1,
    publicado: 2,
    nao_aprovado: 3,
  };

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('user_documents')
      .select('id, name, author, estado, tag_id');

    if (error) console.error("Erro ao buscar documentos:", error.message);
    else setDocuments(data);
  };

  const fetchTags = async () => {
    const { data, error } = await supabase
      .from('document_tags')
      .select('id, designacao');

    if (error) console.error("Erro ao buscar tags:", error.message);
    else setTags(data);
  };

  const openTagEditor = async (doc) => {
    setSelectedDocId(doc.id);
    setSelectedTagId(doc.tag_id ?? null);
    await fetchTags();
    setShowModal(true);
  };

  const updateEstado = async (id, novoEstado) => {
    const { error } = await supabase
      .from('user_documents')
      .update({ estado: novoEstado })
      .eq('id', id);

    if (error) console.error("Erro ao atualizar estado:", error.message);
    else setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const updateTagId = async () => {
    if (selectedDocId == null || selectedTagId == null) return;

    const { error } = await supabase
      .from('user_documents')
      .update({ tag_id: selectedTagId })
      .eq('id', selectedDocId);

    if (error) {
      console.error("Erro ao atualizar tag:", error.message);
    } else {
      setShowModal(false);
      fetchDocuments(); // Refresh docs
    }
  };

  const getEstadoLabel = (estado) => {
    switch (estado) {
      case ESTADOS.por_aprovar: return "Por Aprovar";
      case ESTADOS.publicado: return "Publicado";
      default: return "Desconhecido";
    }
  };

  useEffect(() => { fetchDocuments(); }, []);

  return (
    <>
      <div><Header /></div>

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

          <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
            {documents
              .filter((doc) =>
                doc.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((doc) => (
                <div
                  key={doc.id}
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

                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => openTagEditor(doc)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-md text-sm font-medium"
                    >
                      Editar Tags
                    </button>

                    {doc.estado === ESTADOS.por_aprovar && (
                      <>
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
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Modal para selecionar tag única */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold mb-2">Selecionar Tag</h2>
            <select
              value={selectedTagId || ""}
              onChange={(e) => setSelectedTagId(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="" disabled>Selecione uma tag</option>
              {tags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.designacao}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2 pt-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={updateTagId}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
