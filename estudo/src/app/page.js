"use client";
import "../app/globals.css";
import supabase from "./config/supabaseClient";
import PDFViewer from "../components/PdfViewer";
import Script from "next/script"; // Corrige carregamento do Adobe SDK

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <div>
        <h1>Bem-vindo ao Estudo!</h1>
        <p>Esta é a página inicial do nosso aplicativo Next.js.</p>
        <a href="/login" style={{ color: "blue", textDecoration: "underline" }}>
          Ir para a página de login
        </a>
      </div>

      <div style={{ marginTop: "20px", width: "80%" }}>
        <h1>Visualizador de PDF</h1>
        {/* Substitua pela URL do PDF que deseja visualizar */}
        <PDFViewer url="arquivos/teste.pdf" />
      </div>

      <div style={{ marginTop: "20px" }}>
        <h1>Teste de listas PDF</h1>
        <a
          href="/lista-documentos"
          style={{ color: "blue", textDecoration: "underline" }}
        >
          Lista documentos
        </a>
      </div>
    </div>
  );
}
