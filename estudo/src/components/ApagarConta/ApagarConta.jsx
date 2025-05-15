"use client";

import { useState, useEffect } from "react";
import Header from "../HeaderInicioAdmin";
import { Search, XCircle } from "lucide-react";
import { Kanit } from "next/font/google";
import supabase from "@/app/config/supabaseClient";

const kanit = Kanit({
  subsets: ["latin"],
  weight: "400",
});

export default function ApagarConta() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from("user_details")
        .select("id_user, nome, id_tipo_user, email, id_curso")
        .in("id_tipo_user", [1, 2, 3, 4]); // Apenas utilizadores ativos

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

  const handleDeactivateUser = async (id_user, nome) => {
    const confirm = window.confirm(
      `Tens a certeza que queres desativar o utilizador "${nome}"?`
    );

    if (!confirm) return;

    const { error } = await supabase
      .from("user_details")
      .update({ id_tipo_user: 5 }) // 5 = user_inativo
      .eq("id_user", id_user);

    if (error) {
      console.error("Erro ao desativar utilizador:", error);
    } else {
      alert(`Utilizador "${nome}" foi desativado.`);
      window.location.reload();
    }
  };

  const getTipoUserTexto = (tipo) => {
    switch (tipo) {
      case 1:
        return "Aluno";
      case 2:
        return "Moderador";
      case 3:
        return "Administrador";
      case 4:
        return "Por Validar";
      case 5:
        return "Inativo";
      default:
        return "Desconhecido";
    }
  };

  return (
    <>
      <Header />

      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-4xl bg-blue-900 p-6 rounded-xl shadow-lg">
          
          {/* Barra de Pesquisa */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Pesquisar utilizador"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 pl-4 rounded-lg bg-green-500 text-white placeholder-white focus:outline-none"
            />
            <Search className="absolute right-3 top-3 text-white" />
          </div>

          {/* Lista de Utilizadores */}
          <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-2">
            {users
              .filter((user) =>
                user.nome.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase())
              )
              .map((user) => (
                <div
                  key={user.id_user}
                  className="flex flex-col sm:flex-row items-center justify-between bg-blue-600 p-4 rounded-lg shadow-md"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-12 h-12 rounded-full bg-blue-500" />
                    <div className="text-center sm:text-left">
                      <h3 className="text-white font-bold">{user.nome}</h3>
                      <p className="text-gray-300 text-sm">{user.email}</p>
                      <p className="text-gray-400 text-xs">{getCursoNomeById(user.id_curso)}</p>
                      <p className="text-gray-300 text-xs italic">Tipo: {getTipoUserTexto(user.id_tipo_user)}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <XCircle
                      className="text-red-500 cursor-pointer"
                      size={24}
                      title="Desativar utilizador"
                      onClick={() => handleDeactivateUser(user.id_user, user.nome)}
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
