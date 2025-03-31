"use client";

import { Inter } from "next/font/google";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import supabase from "@/app/config/supabaseClient";

const inter = Inter({
  subsets: ['latin'],
  weight: "400",
});

export default function RegistoForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [nome, setNome] = useState("");
  const [curso, setCurso] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password || !confirmarPassword || !nome || !curso) {
      setErro("Por favor, preencha todos os campos!");
      return;
    }
  };

  return (
    <>
      <div className="w-full max-w-2xl rounded-xl overflow-hidden">
        <form onSubmit={handleSubmit} className="px-8 2xl:py-10 lg:py-5 w-full">
          {erro && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg mb-4">
              {erro}
            </div>
          )}

          <div className="space-y-4">
            <div className="w-full">
              <label className="block">Nome:</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={`${inter.className} bg-white rounded-xl h-10 mt-1 w-full px-3 py-2 border border-gray-400
                  shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent`}
              />
            </div>
            <div className="w-full">
              <label className="block">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inter.className} bg-white rounded-xl h-10 mt-1 w-full px-3 py-2 border border-gray-400
                  shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent`}
              />
            </div>
            <div className="w-full">
              <label className="block">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inter.className} bg-white rounded-xl h-10 mt-1 w-full px-3 py-2 border border-gray-400
                  shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent`}
              />
            </div>
            <div className="w-full">
              <label className="block">Confirme a Password:</label>
              <input
                type="password"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                className={`${inter.className} bg-white rounded-xl h-10 mt-1 w-full px-3 py-2 border border-gray-400
                  shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent`}
              />
            </div>
            <div className="w-full relative">
              <label className="block">Curso</label>
              <select
                value={curso}
                onChange={(e) => setCurso(e.target.value)}
                className={`${inter.className} bg-white rounded-xl h-10 mt-1 w-full px-3 pr-8 py-2 border border-gray-400
                  shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent appearance-none`}
              >
                <option value="Ola">Ola</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 pt-6">
                <svg
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex justify-center md:pt-0 pt-20">
            <button
              type="submit"
              className="lg:w-1/2 md:w-2/3 md:mt-10 2xl:mt-20 px-5 md:px-0 bg-[#012B55] text-white py-2 text-xl md:text-2xl 2xl:text-4xl rounded-4xl hover:bg-blue-800
                transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-opacity-50"
            >
              Registar
            </button>
          </div>

          <div className="flex justify-center 2xl:px-10">
            <div className="text-center mt-8 xl:mt-15">
              <p className="text-2xl md:text-xl lg:text-2xl font-bold">
                Se já tem conta, faça login{" "}
                <Link
                  href="/login"
                  className="text-white underline hover:text-blue-800 font-medium"
                >
                  aqui
                </Link>
                !
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}