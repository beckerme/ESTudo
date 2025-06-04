"use client";

import { Kanit } from "next/font/google";
import { useEffect, useState } from "react";
import supabase from "@/app/config/supabaseClient";
import Header from "../HeaderInicioAdmin";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import * as XLSX from "xlsx";

const kanit = Kanit({ subsets: ["latin"], weight: "400" });

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#9c27b0", "#e91e63"];

export default function AdminDashboard() {
  // Traduções multilíngues
  const texts = {
    pt: {
      adminPanel: "Painel de Administração",
      export: "Exportar Dados",
      exportTitle: "Exportar dados para Excel",
      numDocs: "Nº de Documentos",
      numUsers: "Nº de Utilizadores",
      userList: "Lista de Utilizadores",
      name: "Nome",
      email: "Email",
      type: "Tipo",
      noUsers: "Nenhum utilizador encontrado.",
      docsByTag: "Distribuição de Documentos por Tag",
      tagName: "Nome da Tag",
      numDocsCol: "Número de Documentos",
      noTagData: "Sem dados para mostrar o gráfico.",
      noDocs: "Nenhum documento encontrado",
      total: "TOTAL",
      summary: "Resumo",
      summarySheet: "Resumo",
      exportInfo: "Informações de Exportação",
      exportDate: "Data de Exportação:",
      exportTime: "Hora de Exportação:",
      detailedStats: "Estatísticas Detalhadas",
      numTags: "Número de Tags Diferentes",
      exportSuccess: (file, users, tags, docs) => `Dados exportados com sucesso!\n\nArquivo: ${file}\n\nConteúdo exportado:\n• ${users} utilizadores\n• ${tags} tags de documentos\n• ${docs} documentos totais`,
      exportError: "Erro ao exportar dados. Verifique os dados e tente novamente."
    },
    en: {
      adminPanel: "Admin Panel",
      export: "Export Data",
      exportTitle: "Export data to Excel",
      numDocs: "Number of Documents",
      numUsers: "Number of Users",
      userList: "User List",
      name: "Name",
      email: "Email",
      type: "Type",
      noUsers: "No users found.",
      docsByTag: "Document Distribution by Tag",
      tagName: "Tag Name",
      numDocsCol: "Number of Documents",
      noTagData: "No data to display the chart.",
      noDocs: "No documents found",
      total: "TOTAL",
      summary: "Summary",
      summarySheet: "Summary",
      exportInfo: "Export Information",
      exportDate: "Export Date:",
      exportTime: "Export Time:",
      detailedStats: "Detailed Statistics",
      numTags: "Number of Different Tags",
      exportSuccess: (file, users, tags, docs) => `Data exported successfully!\n\nFile: ${file}\n\nExported content:\n• ${users} users\n• ${tags} document tags\n• ${docs} total documents`,
      exportError: "Error exporting data. Check the data and try again."
    }
  };
  const [currentLang, setCurrentLang] = useState("pt");
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

  const exportToExcel = () => {
    try {
      // Criar um novo workbook
      const workbook = XLSX.utils.book_new();

      // Folha 1: Lista de Utilizadores (exatamente como na tabela da imagem)
      const usersData = [
        [texts[currentLang].userList, "", ""],
        ["", "", ""],
        [texts[currentLang].name, texts[currentLang].email, texts[currentLang].type]
      ];

      // Adicionar dados dos utilizadores exatamente como aparecem na tabela
      users.forEach(user => {
        usersData.push([
          user.nome || "",
          user.email || "",
          user.tipo_user?.tipo_user || ""
        ]);
      });

      // Se não houver utilizadores
      if (users.length === 0) {
        usersData.push([texts[currentLang].noUsers, "", ""]);
      }

      const usersSheet = XLSX.utils.aoa_to_sheet(usersData);
      
      // Definir largura das colunas para melhor visualização
      usersSheet['!cols'] = [
        { width: 15 }, // Nome
        { width: 25 }, // Email
        { width: 15 }  // Tipo
      ];
      
      XLSX.utils.book_append_sheet(workbook, usersSheet, texts[currentLang].userList);

      // Folha 2: Distribuição de Documentos por Tag (dados do gráfico)
      const docsData = [
        [texts[currentLang].docsByTag, ""],
        ["", ""],
        [texts[currentLang].tagName, texts[currentLang].numDocsCol]
      ];

      // Adicionar dados das tags exatamente como no gráfico
      docsByTag.forEach(item => {
        docsData.push([
          item.tag,
          item.count
        ]);
      });

      // Se não houver dados de tags
      if (docsByTag.length === 0) {
        docsData.push([texts[currentLang].noDocs, "0"]);
      }

      // Adicionar linha de total
      if (docsByTag.length > 0) {
        docsData.push(["", ""]);
        docsData.push([texts[currentLang].total, numDocs]);
      }

      const docsSheet = XLSX.utils.aoa_to_sheet(docsData);
      
      // Definir largura das colunas
      docsSheet['!cols'] = [
        { width: 25 }, // Nome da Tag
        { width: 20 }  // Número de Documentos
      ];
      
      XLSX.utils.book_append_sheet(workbook, docsSheet, texts[currentLang].docsByTag);

      // Folha 3: Resumo Geral com métricas principais
      const summaryData = [
        [texts[currentLang].numDocs, texts[currentLang].numUsers],
        [numDocs, numUsers],
        ["", ""],
        [texts[currentLang].exportInfo, ""],
        [texts[currentLang].exportDate, new Date().toLocaleDateString(currentLang === "pt" ? "pt-PT" : "en-US")],
        [texts[currentLang].exportTime, new Date().toLocaleTimeString(currentLang === "pt" ? "pt-PT" : "en-US")],
        ["", ""],
        [texts[currentLang].detailedStats, ""],
        [texts[currentLang].numDocs, numDocs],
        [texts[currentLang].numUsers, numUsers],
        [texts[currentLang].numTags, docsByTag.length]
      ];
      
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      
      // Definir largura das colunas
      summarySheet['!cols'] = [
        { width: 30 },
        { width: 15 }
      ];
      
      XLSX.utils.book_append_sheet(workbook, summarySheet, texts[currentLang].summarySheet);

      // Gerar o arquivo e fazer download
      const timestamp = new Date().toISOString().split('T')[0];
      const fileName = `Relatorio_Admin_${timestamp}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      // Mostrar mensagem de sucesso
      alert(texts[currentLang].exportSuccess(fileName, users.length, docsByTag.length, numDocs));
      
    } catch (error) {
      console.error("Erro ao exportar para Excel:", error);
      alert(texts[currentLang].exportError);
    }
  };

  useEffect(() => {
    fetchCountsAndUsers();
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

      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-5xl bg-white p-6 rounded-xl shadow-lg space-y-6">
          <h1 className="text-2xl font-bold text-blue-900">{texts[currentLang].adminPanel}</h1>

          {/* Botão de Exportação */}
            <button
              onClick={exportToExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
              title={texts[currentLang].exportTitle}
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              {texts[currentLang].export}
            </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-100 text-blue-900 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold">{texts[currentLang].numDocs}</h2>
              <p className="text-3xl">{numDocs}</p>
            </div>
            <div className="bg-green-100 text-green-900 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold">{texts[currentLang].numUsers}</h2>
              <p className="text-3xl">{numUsers}</p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{texts[currentLang].userList}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left py-2 px-4 border-b">{texts[currentLang].name}</th>
                    <th className="text-left py-2 px-4 border-b">{texts[currentLang].email}</th>
                    <th className="text-left py-2 px-4 border-b">{texts[currentLang].type}</th>
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
                        {texts[currentLang].noUsers}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{texts[currentLang].docsByTag}</h2>
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
                <p className="text-gray-500">{texts[currentLang].noTagData}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
