"use client";

import Pesquisa from "@/components/Pesquisa/Pesquisa";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function App() {

const router = useRouter();
const [autorizado, setAutorizado] = useState(null); // null = verificando

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");

    if (tipo === "admin") {
      setAutorizado(false);
      router.push("/mensagem-erro");
    } else {
      setAutorizado(true);   
    }
  }, [router]);

  if (autorizado === null) {
    return null; 
  }

  if (!autorizado) {
    return null; 
  }
    return <Pesquisa />;
}