"use client";

import ValidarDocumento from "@/components/validar-documento/validar-documento";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


export default function App() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(null); 

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");

    if (tipo === "mod") {
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

  return <ValidarDocumento/>;
}


