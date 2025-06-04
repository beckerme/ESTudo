"use client";
import ApagarConta from "@/components/ApagarConta/ApagarConta";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function App() {
  const router = useRouter(); //  router tem de ser definido ANTES de ser usado
  const [autorizado, setAutorizado] = useState(null); //  define também o estado

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
    return null; // ainda a verificar
  }

  if (!autorizado) {
    return null; // não autorizado
  }

  return <ApagarConta />;
}
