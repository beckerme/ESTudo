"use client";

import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import supabase from "@/app/config/supabaseClient";

const inter = Inter({ subsets: ["latin"], weight: "400" });

export default function RegistoForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [nome, setNome] = useState("");
  const [curso, setCurso] = useState("");

  const [erro, setErro] = useState("");
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    const fetchCursos = async () => {
      const { data, error } = await supabase.from("curso").select("id_curso, nome_curso");
      if (error) {
        console.error("Erro ao buscar cursos:", error);
        setCursos([]);
      } else {
        setCursos(data);
      }
    };

    fetchCursos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password || !confirmarPassword || !nome || !curso) {
      setErro("Por favor, preencha todos os campos!");
      return;
    }
  
    if (!email.endsWith("@ipcb.pt") && !email.endsWith("@ipcbcampus.pt")) {
      setErro("Apenas emails institucionais (@ipcb.pt ou @ipcbcampus.pt) são permitidos!");
      return;
    }
  
    if (password !== confirmarPassword) {
      setErro("As passwords não coincidem!");
      return;
    }
  
    // Step 1: Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
  
    if (authError) {
      setErro("Erro ao registrar: " + authError.message);
      return;
    }
  
    // Step 2: Fetch the ID of the selected course
    const { data: cursoData, error: cursoError } = await supabase
      .from("curso")
      .select("id_curso")
      .eq("nome_curso", curso)
      .single();
  
    if (cursoError || !cursoData) {
      setErro("Erro ao obter o ID do curso: " + (cursoError?.message || "Curso não encontrado."));
      return;
    }
  
    const idCurso = cursoData.id_curso;
  
    // Step 3: Insert user into the 'user' table
    const { error: insertError } = await supabase.from("user_details").insert({
      id_user: authData.user.id,
      nome,
      id_tipo_user: 4, // Default user type
      id_curso: idCurso, // Use the fetched course ID
      email: email,
    });
  
    if (insertError) {
      setErro("Erro ao salvar os dados: " + insertError.message);
      return;
    }
  
    setErro(null);
    router.push("/login");
  };
  

  return (
    <div className="w-full max-w-2xl rounded-xl overflow-hidden">
      <form onSubmit={handleSubmit} className="px-8 py-10 w-full">
        {erro && <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg mb-4">{erro}</div>}

        <div className="space-y-4">
          <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" className="input-field" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input-field" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="input-field" />
          <input type="password" value={confirmarPassword} onChange={(e) => setConfirmarPassword(e.target.value)} placeholder="Confirme a Password" className="input-field" />
          <select value={curso} onChange={(e) => setCurso(e.target.value)} className="input-field">
            <option value="">Selecione um curso</option>
            {cursos.map((cursoItem) => (
              <option key={`curso-${cursoItem.id_curso}`} value={cursoItem.nome_curso}>{cursoItem.nome_curso}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-button">Registar</button>

        <p className="text-center mt-8">
          Já tem conta? <Link href="/login" className="text-blue-600 underline">Faça login aqui</Link>
        </p>
      </form>
    </div>
  );
}
