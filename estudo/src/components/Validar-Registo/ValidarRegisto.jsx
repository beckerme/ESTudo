"use client"

import { useState } from "react";
import Header from "../HeaderInicio";
import { Search, CheckCircle, XCircle, Bell, Globe } from "lucide-react";
import { Kanit } from "next/font/google";

const kanit = Kanit({
  subsets: ["latin"],
  weight: "400",
});

const users = [
  { name: "Maria Tavares", email: "maria.tavares@ipcbcampus.pt", role: "Engenharia Informática", color: "bg-red-500" },
  { name: "José Campos", email: "jose.campos@ipcbcampus.pt", role: "Engenharia Civil", color: "bg-yellow-500" },
  { name: "Raquel Teixeira", email: "raquel.teixeira@ipcbcampus.pt", role: "Professora", color: "bg-pink-500" },
];

export default function ValidarRegisto() {
  const [search, setSearch] = useState("");

  return (
    <>
      <div>
          <Header/> 
      </div>
      
      {/* Caixa de Pesquisa */}
      <div className="w-full max-w-6xl mt-6 bg-blue-900 p-4 rounded-lg">
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisa"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 pl-4 rounded-lg bg-green-500 text-white placeholder-white focus:outline-none"
          />
          <Search className="absolute right-3 top-3 text-white" />
        </div>

        {/* Lista de Usuários */}
        <div className="mt-4 space-y-4">
          {users
            .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
            .map((user, index) => (
              <div key={index} className="flex flex-col sm:flex-row items-center justify-between bg-blue-600 p-4 rounded-lg shadow-md">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className={`w-12 h-12 rounded-full ${user.color}`}></div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-white font-bold">{user.name}</h3>
                    <p className="text-gray-300 text-sm">{user.email}</p>
                    <p className="text-gray-400 text-xs">{user.role}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <XCircle className="text-red-500 cursor-pointer" size={24} />
                  <CheckCircle className="text-green-500 cursor-pointer" size={24} />
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

