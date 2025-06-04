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

  return (
    <>
      <Toaster position="top-right" />

      <div>
        <Header />
      </div>

      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-4xl bg-blue-900 p-6 rounded-xl shadow-lg">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder={texts[currentLang].searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 pl-4 rounded-lg bg-green-500 text-white placeholder-white focus:outline-none"
            />
            <Search className="absolute right-3 top-3 text-white" />
          </div>

          <div className="bg-blue-800 rounded-lg p-3 mb-4 text-center">
            <p className="text-white">
              <span className="font-bold">{users.length}</span> {texts[currentLang].pending(users.length)}
            </p>
          </div>

          <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
            {users.length === 0 ? (
              <div className="bg-blue-700 p-4 rounded-lg text-center text-white">
                {texts[currentLang].noPending}
              </div>
            ) : (
              users
                .filter((user) =>
                  user.nome.toLowerCase().includes(search.toLowerCase())
                )
                .map((user, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-center justify-between bg-blue-600 p-4 rounded-lg shadow-md"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        {user.nome.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-center sm:text-left">
                        <h3 className="text-white font-bold">{user.nome}</h3>
                        <p className="text-gray-300 text-sm">{user.email}</p>
                        <p className="text-gray-400 text-xs">
                          {getCursoNomeById(user.id_curso)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <button
                        disabled={isLoading}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors"
                        onClick={() =>
                          handleDeactivateUser(user.id_user, user.nome)
                        }
                      >
                        <XCircle size={16} />
                        <span>{texts[currentLang].reject}</span>
                      </button>
                      <button
                        disabled={isLoading}
                        className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition-colors"
                        onClick={() =>
                          handleValidateUser(
                            user.id_user,
                            user.email,
                            user.nome
                          )
                        }
                      >
                        <CheckCircle size={16} />
                        <span>{texts[currentLang].validate}</span>
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
