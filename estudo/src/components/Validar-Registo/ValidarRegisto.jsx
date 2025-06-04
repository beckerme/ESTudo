"use client";

import { useState, useEffect } from "react";
import Header from "../HeaderInicioAdmin";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { Kanit } from "next/font/google";
import supabase from "@/app/config/supabaseClient";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";

const kanit = Kanit({
  subsets: ["latin"],
  weight: "400",
});

export default function ValidarRegisto() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLang, setCurrentLang] = useState("pt");

  // Textos multilíngues
  const texts = {
    pt: {
      searchPlaceholder: "Pesquisa por nome",
      pending: (n) => `${n} registos pendentes de validação`,
      noPending: "Não existem registos pendentes de validação.",
      reject: "Rejeitar",
      validate: "Validar",
      deactivateSuccess: (nome) => `Utilizador ${nome} desativado com sucesso!`,
      deactivateError: "Erro ao desativar utilizador",
      validateSuccess: (nome) => `Utilizador ${nome} validado e notificado com sucesso!`,
      validatePartial: (nome) => `Utilizador ${nome} validado, mas houve um problema ao enviar a notificação.`,
      validateError: "Erro ao validar utilizador",
      notFound: "Curso não encontrado"
    },
    en: {
      searchPlaceholder: "Search by name",
      pending: (n) => `${n} registrations pending validation`,
      noPending: "No registrations pending validation.",
      reject: "Reject",
      validate: "Validate",
      deactivateSuccess: (nome) => `User ${nome} deactivated successfully!`,
      deactivateError: "Error deactivating user",
      validateSuccess: (nome) => `User ${nome} validated and notified successfully!`,
      validatePartial: (nome) => `User ${nome} validated, but there was a problem sending the notification.`,
      validateError: "Error validating user",
      notFound: "Course not found"
    }
  };

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "pt";
    setCurrentLang(lang);
    const onLangChange = (e) => {
      if (e.detail && e.detail.lang) setCurrentLang(e.detail.lang);
    };
    window.addEventListener("langChange", onLangChange);
    return () => window.removeEventListener("langChange", onLangChange);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("user_details")
        .select("id_user, nome, id_tipo_user, email, id_curso")
        .eq("id_tipo_user", 4);

      if (error) {
        console.error("Erro ao buscar utilizadores:", error);
        setUsers([]);
      } else {
        setUsers(data);
      }
    };

    const fetchCursos = async () => {
      const { data, error } = await supabase
        .from("curso")
        .select("id_curso, nome_curso");

      if (error) {
        console.error("Erro ao buscar cursos:", error);
        setCursos([]);
      } else {
        setCursos(data);
      }
    };

    fetchUsers();
    fetchCursos();
  }, []);

  const getCursoNomeById = (id) => {
    const curso = cursos.find((c) => c.id_curso === id);
    return curso ? curso.nome_curso : texts[currentLang].notFound;
  };

  const handleValidateUser = async (id_user, email, nome) => {
    setIsLoading(true);

    let novoTipoUser = 1;
    if (email.includes("@ipcbcampus.pt")) {
      novoTipoUser = 3;
    } else if (email.includes("@ipcb.pt")) {
      novoTipoUser = 2;
    }

    const { error } = await supabase
      .from("user_details")
      .update({ id_tipo_user: novoTipoUser })
      .eq("id_user", id_user);

    if (error) {
      console.error("Erro ao validar utilizador:", error);
      toast.error(texts[currentLang].validateError);
      setIsLoading(false);
      return;
    }

    const mensagem = "O seu registo foi validado com sucesso ";
    const notificationSent = await createNotification(
      id_user,
      mensagem,
      "registo_validado"
    );

    if (notificationSent) {
      toast.success(texts[currentLang].validateSuccess(nome));
    } else {
      toast.success(texts[currentLang].validatePartial(nome));
    }

    const { data: updatedUsers } = await supabase
      .from("user_details")
      .select("id_user, nome, id_tipo_user, email, id_curso")
      .eq("id_tipo_user", 4);

    if (updatedUsers) {
      setUsers(updatedUsers);
    }

    setIsLoading(false);
  };

  const handleDeactivateUser = async (id_user, nome) => {
    setIsLoading(true);

    const { error } = await supabase
      .from("user_details")
      .update({ id_tipo_user: 5 })
      .eq("id_user", id_user);

    if (error) {
      console.error("Erro ao desativar utilizador:", error);
      toast.error(texts[currentLang].deactivateError);
    } else {
      toast.success(texts[currentLang].deactivateSuccess(nome));

      const { data: updatedUsers } = await supabase
        .from("user_details")
        .select("id_user, nome, id_tipo_user, email, id_curso")
        .eq("id_tipo_user", 4);

      if (updatedUsers) {
        setUsers(updatedUsers);
      }
    }

    setIsLoading(false);
  };

  const getNotificationTypeId = async (descricao) => {
    const { data, error } = await supabase
      .from("notification_type")
      .select("id_tipo_notificacao")
      .eq("descricao", descricao)
      .single();

    if (error || !data) {
      console.error(`Erro ao buscar tipo de notificação "${descricao}"`, error);
      throw new Error("Tipo de notificação não encontrado");
    }

    return data.id_tipo_notificacao;
  };

  const getNotificationStateId = async (estado) => {
    const { data, error } = await supabase
      .from("notification_state")
      .select("id_estado")
      .eq("estado", estado)
      .single();

    if (error || !data) {
      console.error(`Erro ao buscar estado da notificação "${estado}"`, error);
      throw new Error("Estado de notificação não encontrado");
    }

    return data.id_estado;
  };

  const createNotification = async (
    userId,
    message,
    tipoNotificacao = "registo_validado"
  ) => {
    try {
      const tipoNotificacaoId = await getNotificationTypeId(tipoNotificacao);
      const estadoNotificacaoId = await getNotificationStateId("nao_lida");

      const { error } = await supabase.from("user_notifications").insert([
        {
          id_user: userId,
          created_at: new Date().toISOString(),
          id_tipo_notification: tipoNotificacaoId,
          id_estado: estadoNotificacaoId,
          mensagem: message,
        },
      ]);

      if (error) {
        console.error("Erro ao criar notificação:", error);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Erro ao processar notificação:", err);
      return false;
    }
  };

  // Filtered users based on search
  const filteredUsers = users.filter((user) =>
    user.nome.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Toaster position="top-right" />

      <div>
        <Header />
      </div>

      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-4xl p-6">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Pesquisa"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 pl-4 bg-[#007CC2] rounded-3xl text-white placeholder-white focus:outline-none"
            />
            <Search className="absolute right-3 top-3 text-white" />
          </div>

          <div className="flex flex-col items-center w-full">
            <div className="space-y-4 w-full max-w-4xl">
              {filteredUsers.length === 0 ? (
                <div className="text-center p-4 text-gray-600 w-full">
                  {users.length === 0 ? (
                    "Não existem registos pendentes de validação."
                  ) : (
                    "Nenhum utilizador encontrado."
                  )}
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id_user}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      {/* User information area */}
                      <div className="flex items-center gap-4 flex-1 mr-4 min-w-0">
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {user.nome.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h2 className="text-lg font-semibold text-gray-900 mb-1 truncate" title={user.nome}>
                            {user.nome}
                          </h2>
                          <p className="text-sm text-gray-600 mb-2 truncate" title={user.email}>
                            {user.email}
                          </p>
                          <p className="text-xs text-gray-500">
                            {getCursoNomeById(user.id_curso)}
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 flex-shrink-0">
                          <>
                            <XCircle
                              className="text-red-500 cursor-pointer"
                              size={24}
                              onClick={() =>
                                handleDeactivateUser(user.id_user, user.nome)
                              }
                            />
                            <CheckCircle
                              className="text-green-500 cursor-pointer"
                              size={24}
                              onClick={() =>
                                handleValidateUser(
                                  user.id_user,
                                  user.email,
                                  user.nome
                                )
                              }
                            />
                          </>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}