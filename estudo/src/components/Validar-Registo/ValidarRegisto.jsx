"use client";

import { useState, useEffect } from "react";
import Header from "../HeaderInicio";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { Kanit } from "next/font/google";
import supabase from "@/app/config/supabaseClient";

const kanit = Kanit({
  subsets: ["latin"],
  weight: "400",
});

export default function ValidarRegisto() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [cursos, setCursos] = useState([]);

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

  const handleValidateUser = async (id_user, email) => {
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
    } else {
      window.location.reload(); // Atualiza a página após a validação
    }
  };

  const handleDeactivateUser = async (id_user) => {
    const { error } = await supabase
      .from("user_details")
      .update({ id_tipo_user: 5 })
      .eq("id_user", id_user);

    if (error) {
      console.error("Erro ao desativar utilizador:", error);
    } else {
      window.location.reload(); // Atualiza a página após a desativação
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
              placeholder="Pesquisa"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 pl-4 rounded-lg bg-green-500 text-white placeholder-white focus:outline-none"
            />
            <Search className="absolute right-3 top-3 text-white" />
          </div>

          {/* Lista com scroll */}
          <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
            {users
              .filter((user) =>
                user.nome.toLowerCase().includes(search.toLowerCase())
              )
              .map((user, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center justify-between bg-blue-600 p-4 rounded-lg shadow-md"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-12 h-12 rounded-full bg-blue-500"></div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-white font-bold">{user.nome}</h3>
                      <p className="text-gray-300 text-sm">{user.email}</p>
                      <p className="text-gray-400 text-xs">
                        {getCursoNomeById(user.id_curso)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <XCircle
                      className="text-red-500 cursor-pointer"
                      size={24}
                      onClick={() => handleDeactivateUser(user.id_user)}
                    />
                    <CheckCircle
                      className="text-green-500 cursor-pointer"
                      size={24}
                      onClick={() => handleValidateUser(user.id_user, user.email)}
                    />
                  </div>
                </div>
              ))}
          </div>

        </div>
      </div>
    </>
  );
}
