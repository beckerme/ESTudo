"use client";

import { useState, useEffect } from "react";
import Header from "../HeaderInicioAdmin";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { Kanit } from "next/font/google";
import supabase from "@/app/config/supabaseClient";
import { useRouter } from "next/navigation";

const kanit = Kanit({
  subsets: ["latin"],
  weight: "400",
});

export default function ValidarRegisto() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    return curso ? curso.nome_curso : "Curso não encontrado";
  };

  // Function to send notification to user
  const sendUserNotification = async (userId, userEmail, newUserType) => {
    try {
      // Insert notification in the notifications table
      const { error } = await supabase.from("notifications").insert({
        id_user: userId,
        message: `A sua conta foi validada com sucesso. Bem-vindo!`,
        tipo: "validation",
        is_read: false,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Erro ao enviar notificação:", error);
        return false;
      }

      // Optionally, send an email notification
      // This would typically be done via a serverless function or backend service
      // The code below is a placeholder for where you would implement this
      const userTypeNames = {
        1: "Estudante",
        2: "Professor",
        3: "Estudante Erasmus",
      };

      const emailData = {
        to: userEmail,
        subject: "Conta Validada - Sistema IPCB",
        body: `Olá,
        
A sua conta foi validada com sucesso como ${
          userTypeNames[newUserType] || "Utilizador"
        }.
Agora pode aceder a todas as funcionalidades do sistema.

Cumprimentos,
Equipa IPCB`,
      };

      // Here you would call your email sending function
      // This is just a placeholder - you need a real email sending service
      console.log("Email de notificação seria enviado:", emailData);

      return true;
    } catch (error) {
      console.error("Erro ao processar notificação:", error);
      return false;
    }
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
      toast.error("Erro ao validar utilizador");
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
      toast.success(`Utilizador ${nome} validado e notificado com sucesso!`);
    } else {
      toast.success(
        `Utilizador ${nome} validado, mas houve um problema ao enviar a notificação.`
      );
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
      toast.error("Erro ao desativar utilizador");
    } else {
      toast.success(`Utilizador ${nome} desativado com sucesso!`);

      // Update UI by refetching users
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
      <div>
        <Header />
      </div>

      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-4xl bg-blue-900 p-6 rounded-xl shadow-lg">
          {/* Caixa de Pesquisa */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Pesquisa por nome"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 pl-4 rounded-lg bg-green-500 text-white placeholder-white focus:outline-none"
            />
            <Search className="absolute right-3 top-3 text-white" />
          </div>

          {/* Contador de Registos Pendentes */}
          <div className="bg-blue-800 rounded-lg p-3 mb-4 text-center">
            <p className="text-white">
              <span className="font-bold">{users.length}</span> registos
              pendentes de validação
            </p>
          </div>

          {/* Lista com scroll */}
          <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
            {users.length === 0 ? (
              <div className="bg-blue-700 p-4 rounded-lg text-center text-white">
                Não existem registos pendentes de validação.
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
                        <span>Rejeitar</span>
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
                        <span>Validar</span>
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
