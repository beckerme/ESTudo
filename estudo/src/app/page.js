"use client";
import "../app/globals.css";
import supabase from "./config/supabaseClient";
import PDFViewer from "../components/PdfViewer";
import Script from "next/script"; // Corrige carregamento do Adobe SDK

export default function Home() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center' }}>
      <div>
        <h1>Bem-vindo ao Estudo!</h1>
        <p>Esta é a página inicial do nosso aplicativo Next.js.</p>
        <a href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>Ir para a página de login</a>

        <h1>Visualizador de PDF</h1>
        <PDFViewer url="teste.pdf" />

        {/* Carrega o SDK do Adobe corretamente */}
        <Script
          src="https://documentservices.adobe.com/view-sdk/viewer.js"
          strategy="lazyOnload"
          onLoad={() => console.log("Adobe SDK carregado!")}
        />
      </div>
    </div>
  );
}
