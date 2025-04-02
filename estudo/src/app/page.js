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
    <div>
      <header>
        <button 
          onClick={navigateToLogin} 
          style={{ cursor: "pointer" }}
        >
          Go to Login
        </button>
      </header>
    </div>
  );
}