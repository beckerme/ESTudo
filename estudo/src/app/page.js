"use client";
import "../app/globals.css";
import supabase from "./config/supabaseClient";
import PDFViewer from "../components/PdfViewer";
import Script from "next/script"; // Adicionado para corrigir o erro

export default function Home() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center' }}>
      <div>
        <h1>Bem-vindo ao Estudo!</h1>
        <p>Esta é a página inicial do nosso aplicativo Next.js.</p>
        <a href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>Ir para a página de login</a>

        <h1>Visualizador de PDF</h1>
        <PDFViewer url="https://www.thecampusqdl.com/uploads/files/pdf_sample_2.pdf" />

        <>
          <Script
            src="https://documentservices.adobe.com/view-sdk/viewer.js"
            strategy="beforeInteractive"
          />
        </>
      </div>
    </div>
  );
}