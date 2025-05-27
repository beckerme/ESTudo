"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Estatisticas from "@/components/Estatisticas/Estatisticas";


export default function App() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(null); // null = verificando

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");

    if (tipo === "admin") {
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

  return <Estatisticas/>;

}