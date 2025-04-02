"use client";
import "../app/globals.css";
import supabase from "./config/supabaseClient";
  
export default function Home() {

  //teste de ligação com o supabase
  // console.log(supabase);
  const navigateToLogin = () => {
    window.location.href = "/login";
  };
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center' }}>
      <div>
        <h1>Bem-vindo ao Estudo!</h1>
        <p>Esta é a página inicial do nosso aplicativo Next.js.</p>
        <a href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>Ir para a página de login</a>
      </div>
    </div>
  );
}