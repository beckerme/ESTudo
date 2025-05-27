"use client";
import SubmeterDocumento from "@/components/Submeter-Documento/SubmeterDocumento";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function App() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(null); // null = verificando
  const [currentLang, setCurrentLang] = useState("pt");

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");

    if (tipo === "aluno") {
      setAutorizado(true);
    } else {
      setAutorizado(false);
      router.push("/mensagem-erro");
    }
  }, [router]);

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "pt";
    setCurrentLang(lang);
    const onLangChange = (e) => {
      if (e.detail && e.detail.lang) setCurrentLang(e.detail.lang);
    };
    window.addEventListener("langChange", onLangChange);
    return () => window.removeEventListener("langChange", onLangChange);
  }, []);

  if (autorizado === null) {
    return null; 
  }

  if (!autorizado) {
    return null; 
  }

  return <SubmeterDocumento />;
}
