"use client";

import { Kanit } from "next/font/google";
import { useEffect, useState } from "react";
import supabase from "@/app/config/supabaseClient";
import Header from "../HeaderInicioAdmin";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";

const kanit = Kanit({ subsets: ["latin"], weight: "400" });

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9c27b0", "#e91e63"];

export default function AdminDashboard() {
  const [numDocs, setNumDocs] = useState(0);
  const [numUsers, setNumUsers] = useState(0);
  const [users, setUsers] = useState([]);
  const [docsByTag, setDocsByTag] = useState([]);

  const countDocsByTag = (docs) => {
  const counts = {};
  docs.forEach((doc) => {
    const tag = doc.document_tags?.designacao || "Sem Tag";
    counts[tag] = (counts[tag] || 0) + 1;
  });
  return Object.entries(counts).map(([tag, count]) => ({ tag, count }));
};

  const fetchCountsAndUsers = async () => {
    try {
      // Buscar documentos com tag_id
      const { data: docsData, error: docsError, count: docCount } = await supabase
        .from("user_documents")
        .select("id, document_tags (designacao)", { count: "exact" });

      if (docsError) {
        console.error("Erro ao buscar documentos:", docsError.message);
      } else {
        setNumDocs(docCount);
        const docsByTag = countDocsByTag(docsData || []);
        setDocsByTag(docsByTag);
      }

      // Buscar número de utilizadores
      const { count: userCount, error: userCountError } = await supabase
        .from("user_details")
        .select("*", { count: "exact", head: true });

      if (userCountError) {
        console.error("Erro ao contar utilizadores:", userCountError.message);
      } else {
        setNumUsers(userCount);
      }

      // Buscar dados dos utilizadores
      const { data: usersData, error: usersError } = await supabase
        .from("user_details")
        .select("id_user, nome, email, tipo_user (tipo_user)");

      if (usersError) {
        console.error("Erro ao buscar utilizadores:", usersError.message);
      } else {
        setUsers(usersData);
      }
    } catch (err) {
      console.error("Erro inesperado:", err.message || err);
    }
  };

  useEffect(() => {
    fetchCountsAndUsers();
  }, []);

  return (
    <>
      <div>
        <Header />
      </div>

      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-5xl bg-white p-6 rounded-xl shadow-lg space-y-6">
          <h1 className="text-2xl font-bold text-blue-900">Painel de Administração</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-100 text-blue-900 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold">Nº de Documentos</h2>
              <p className="text-3xl">{numDocs}</p>
            </div>

            <div className="bg-green-100 text-green-900 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold">Nº de Utilizadores</h2>
              <p className="text-3xl">{numUsers}</p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Lista de Utilizadores</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left py-2 px-4 border-b">Nome</th>
                    <th className="text-left py-2 px-4 border-b">Email</th>
                    <th className="text-left py-2 px-4 border-b">Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id_user} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{user.nome}</td>
                      <td className="py-2 px-4">{user.email}</td>
                      <td className="py-2 px-4 capitalize">{user.tipo_user?.tipo_user}</td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-gray-500">
                        Nenhum utilizador encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Distribuição de Documentos por Tag</h2>
            <div className="flex justify-center">
              {docsByTag.length > 0 ? (
                <PieChart width={400} height={300}>
                  <Pie
                    data={docsByTag}
                    dataKey="count"
                    nameKey="tag"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {docsByTag.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : (
                <p className="text-gray-500">Sem dados para mostrar o gráfico.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
