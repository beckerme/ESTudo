"use client";
import "../app/globals.css";
import supabase from "./config/supabaseClient";
import PDFViewer from "../components/PdfViewer";
import Script from "next/script"; // Adicionado para corrigir o erro

<<<<<<< HEAD
  //teste de ligação com o supabase
  // console.log(supabase);
  const navigateToLogin = () => {
    window.location.href = "/login";
  };
  
=======
export default function Home() {
>>>>>>> 5d5c8ba647b88ece728e4a6022989a936538cb02
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center' }}>
      <div>
        <h1>Bem-vindo ao Estudo!</h1>
        <p>Esta é a página inicial do nosso aplicativo Next.js.</p>
        <a href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>Ir para a página de login</a>

        <h1>Visualizador de PDF</h1>
        <PDFViewer url="https://catalogobandasdemusicape.wordpress.com/wp-content/uploads/2019/03/mc3a9todo-bc3a1sico-para-clarinete.pdf" />

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