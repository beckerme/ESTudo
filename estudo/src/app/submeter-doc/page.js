"use client";
import SubmeterDocumento from "@/components/Submeter-Documento/SubmeterDocumento";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function App() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(null); // null = verificando

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");

    if (tipo === "aluno") {
      setAutorizado(true);
    } else {
      setAutorizado(false);
      router.push("/mensagem-erro");
    }
  }, [router]);

  if (autorizado === null) {
    return null; 
  }

  if (!autorizado) {
    return null; 
  }

  return <SubmeterDocumento />;
}
