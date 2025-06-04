"use client";

import { Kanit } from "next/font/google";
import Image from "next/image";
import Header from "../HeaderInicioMod";
import { useState, useEffect } from "react";
import { Search, XCircle, CheckCircle } from "lucide-react";
import supabase from "@/app/config/supabaseClient";
import { useRouter } from "next/navigation";

const kanit = Kanit({ subsets: ["latin"], weight: "400" });

export default function ValidarDocumento() {
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState([]);
  const [tags, setTags] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [currentLang, setCurrentLang] = useState(() => typeof window !== "undefined" ? localStorage.getItem("lang") || "pt" : "pt");

  const ESTADOS = {
    por_aprovar: 1,
    publicado: 2,
    nao_aprovado: 3,
  };

  // Textos multilíngues
  const texts = {
    pt: {
      searchPlaceholder: "Pesquisa",
      state: "Estado:",
      toApprove: "Por Aprovar",
      published: "Publicado",
      unknown: "Desconhecido",
      editTags: "Editar Tags",
      reject: "Rejeitar",
      approve: "Aprovar",
      selectTag: "Selecionar Tag",
      selectTagPlaceholder: "Selecione uma tag",
      cancel: "Cancelar",
      save: "Guardar",
    },
    en: {
      searchPlaceholder: "Search",
      state: "State:",
      toApprove: "To Approve",
      published: "Published",
      unknown: "Unknown",
      editTags: "Edit Tags",
      reject: "Reject",
      approve: "Approve",
      selectTag: "Select Tag",
      selectTagPlaceholder: "Select a tag",
      cancel: "Cancel",
      save: "Save",
    },
  };

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from("user_documents")
      .select("id, name, author, estado, tag_id, user_id")
      .eq("estado", ESTADOS.por_aprovar);

    if (error) console.error("Erro ao buscar documentos:", error.message);
    else setDocuments(data);
  };

  const fetchTags = async () => {
    const { data, error } = await supabase
      .from("document_tags")
      .select("id, designacao");

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
    const doc = documents.find((d) => d.id === id);
    if (!doc) return;

    const { error } = await supabase
      .from("user_documents")
      .update({ estado: novoEstado })
      .eq("id", id);

    if (error) {
      console.error("Erro ao atualizar estado:", error.message);
      return;
    }

    if (novoEstado === ESTADOS.publicado) {
      const mensagem = `O seu documento "${doc.name}" foi aprovado e publicado com sucesso.`;
      await createNotification(doc.user_id, mensagem, "documento_validado");
    }

    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const updateTagId = async () => {
    if (selectedDocId == null || selectedTagId == null) return;

    const { error } = await supabase
      .from("user_documents")
      .update({ tag_id: selectedTagId })
      .eq("id", selectedDocId);

    if (error) {
      console.error("Erro ao atualizar tag:", error.message);
    } else {
      setShowModal(false);
      fetchDocuments();
    }
  };

  const getEstadoLabel = (estado) => {
    switch (estado) {
      case ESTADOS.por_aprovar:
        return texts[currentLang].toApprove;
      case ESTADOS.publicado:
        return texts[currentLang].published;
      default:
        return texts[currentLang].unknown;
    }
  };

  const createNotification = async (
    userId,
    message,
    tipoNotificacao = "documento_validado"
  ) => {
    try {
      // Verificar se o userId é válido
      if (!userId) {
        console.error("ID do usuário inválido:", userId);
        return;
      }

      // Buscar o tipo de notificação
      const { data: tipoData, error: tipoError } = await supabase
        .from("notification_type")
        .select("id_tipo_notificacao")
        .eq("descricao", tipoNotificacao)
        .single();

      if (tipoError) {
        console.error("Erro ao buscar tipo de notificação:", tipoError.message);
        return;
      }

      // Buscar o estado da notificação
      const { data: estadoData, error: estadoError } = await supabase
        .from("notification_state")
        .select("id_estado")
        .eq("estado", "nao_lida")
        .single();

      if (estadoError) {
        console.error("Erro ao buscar estado da notificação:", estadoError.message);
        return;
      }

      // Log para debug antes de inserir
      console.log("Dados para inserção de notificação:", {
        id_user: userId,
        created_at: new Date().toISOString(),
        id_tipo_notificacao: tipoData?.id_tipo_notificacao,
        id_estado: estadoData?.id_estado,
        mensagem: message,
      });

      // Verificar se todos os dados necessários existem
      if (!tipoData?.id_tipo_notificacao || !estadoData?.id_estado) {
        console.error("Dados necessários para a notificação estão faltando");
        return;
      }

      // Inserir a notificação
      const { error } = await supabase.from("user_notifications").insert([
        {
          id_user: userId,
          created_at: new Date().toISOString(),
          id_tipo_notification: tipoData.id_tipo_notificacao,
          id_estado: estadoData.id_estado,
          mensagem: message,
        },
      ]);

      if (error) {
        console.error("Erro ao inserir notificação:", error.message);
        // Log do erro completo para debug
        console.error(error);
      } else {
        console.log("Notificação criada com sucesso");
      }
    } catch (err) {
      console.error("Erro ao criar notificação:", err.message || err);
    }
  };

  // Documentos filtrados
  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    (doc.author && doc.author.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "pt";
    setCurrentLang(lang);
    const onLangChange = (e) => {
      if (e.detail && e.detail.lang) setCurrentLang(e.detail.lang);
    };
    window.addEventListener("langChange", onLangChange);
    return () => window.removeEventListener("langChange", onLangChange);
  }, []);

  return (
    <>
      <div>
        <Header />
      </div>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-4xl p-6">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder={texts[currentLang].searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 pl-4 bg-[#007CC2] rounded-3xl text-white placeholder-white focus:outline-none"
            />
            <Search className="absolute right-3 top-3 text-white" />
          </div>
          <div className="flex flex-col items-center w-full">
            <div className="space-y-4 w-full max-w-4xl">
              {filteredDocuments.length === 0 ? (
                <div className="text-center p-4 text-gray-600 w-full">
                </div>
              ) : (
                filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
                  >
                    {/* ESTRUTURA CORRIGIDA */}
                    <div className="flex justify-between items-start">
                      {/* Área de texto do documento */}
                      <div className="flex-1 mr-4 min-w-0">
                        <h2 className="text-lg font-semibold text-gray-900 mb-1 truncate" title={doc.name}>
                          {doc.name}
                        </h2>
                        <p className="text-sm text-gray-600 mb-2">
                          {doc.author}
                        </p>
                        <p className="text-xs text-gray-500 mb-1">
                          {doc.created_at}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getEstadoLabel(doc.estado)}
                        </p>
                      </div>
                      {/* Botões de ação */}
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => openTagEditor(doc)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-md text-sm font-medium"
                        >
                          {texts[currentLang].editTags}
                        </button>
                        {doc.estado === ESTADOS.por_aprovar && (
                          <>
                            <XCircle
                              className="text-red-500 cursor-pointer"
                              size={24}
                              title={texts[currentLang].reject}
                              onClick={() =>
                                updateEstado(doc.id, ESTADOS.nao_aprovado)
                              }
                            />
                            <CheckCircle
                              className="text-green-500 cursor-pointer"
                              size={24}
                              title={texts[currentLang].approve}
                              onClick={() =>
                                updateEstado(doc.id, ESTADOS.publicado)
                              }
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modal para selecionar tag única */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold mb-2">{texts[currentLang].selectTag}</h2>
            <select
              value={selectedTagId || ""}
              onChange={(e) => setSelectedTagId(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="" disabled>
                {texts[currentLang].selectTagPlaceholder}
              </option>
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
                {texts[currentLang].cancel}
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={updateTagId}
              >
                {texts[currentLang].save}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}