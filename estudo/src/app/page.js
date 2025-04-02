"use client";
import "../app/globals.css";
import supabase from "./config/supabaseClient";
  
export default function Home() {

<<<<<<< HEAD
  //teste de ligação com o supabase
  // console.log(supabase);
  const navigateToLogin = () => {
    window.location.href = "/login";
  };
  
  return (
    <div>
      <header>
        <button 
          onClick={navigateToLogin} 
          style={{ cursor: "pointer" }}
        >
          Go to Login
        </button>
      </header>
=======
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center' }}>
      <div>
        <h1>Bem-vindo ao Estudo!</h1>
        <p>Esta é a página inicial do nosso aplicativo Next.js.</p>
        <a href="/login" style={{ color: 'blue', textDecoration: 'underline' }}>Ir para a página de login</a>
      </div>
>>>>>>> 7143e046d095941d9f6ee45e2ea7d3273fe297e4
    </div>
  );
}