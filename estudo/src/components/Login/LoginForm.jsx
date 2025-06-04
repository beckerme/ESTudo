"use client";

import { Inter } from "next/font/google";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import supabase from "@/app/config/supabaseClient";

const inter = Inter({
  subsets: ['latin'],
  weight: "400",
});

export default function LoginForm({ currentLang = "pt" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  // Textos multilíngues
  const texts = {
    pt: {
      email: "Email:",
      password: "Password:",
      login: "Login",
      fillAll: "Por favor, preencha todos os campos!",
      wrong: "Email ou password incorretos! Por favor tente novamente",
      userTypeError: "Erro ao verificar o tipo de utilizador",
      checkEmail: "Verifique o seu email e espere que o admin valide o seu registo",
      loginFail: "Não foi possível efetuar o login",
      noAccount: "Se não tiver ainda conta, registe-se ",
      here: "aqui",
      required: "!",
    },
    en: {
      email: "Email:",
      password: "Password:",
      login: "Login",
      fillAll: "Please fill in all fields!",
      wrong: "Incorrect email or password! Please try again",
      userTypeError: "Error verifying user type",
      checkEmail: "Check your email and wait for the admin to validate your registration",
      loginFail: "Login failed",
      noAccount: "If you don't have an account yet, register ",
      here: "here",
      required: "!",
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErro(texts[currentLang].fillAll);
      return;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErro(texts[currentLang].wrong);
        return;
      }
      const userId = data.user.id;
      const { data: userDetails, error: userDetailsError } = await supabase
        .from('user_details')
        .select('id_tipo_user')
        .eq('id_user', userId)
        .single();
      if (userDetailsError) {
        setErro(texts[currentLang].userTypeError);
        await supabase.auth.signOut();
        router.push("/registo");
        return;
      }
      if (userDetails.id_tipo_user === 4) {
        setErro(texts[currentLang].checkEmail);
        await supabase.auth.signOut();
        router.push("/registo");
        return;
      }
      if (userDetails.id_tipo_user === 1) {
        localStorage.setItem("tipoUsuario", "admin");
        router.push("/pag-inicial");
        return;
      }
      if (userDetails.id_tipo_user === 2) {
        localStorage.setItem("tipoUsuario", "mod");
        router.push("/pag-inicial");
        return;
      }
      if (userDetails.id_tipo_user === 3) {
        localStorage.setItem("tipoUsuario", "aluno");
        router.push("/pag-inicial");
        return;
      }
      router.push("/pag-inicial");
    } catch(err) {
      setErro(texts[currentLang].loginFail);
      return;
    }
  };

  return (
    <>
      <div className="w-full max-w-2xl rounded-xl overflow-hidden">
        <form onSubmit={handleSubmit} className="px-8 2xl:py-10 lg:py-5 w-full">
          {erro && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg mb-4">
              {erro}
            </div>
          )}
          <div className="space-y-4">
            <div className="w-full">
              <label className="block">{texts[currentLang].email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inter.className} bg-white rounded-xl h-10 mt-1 w-full px-3 py-2 border border-gray-400
                  shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent`}
              />
            </div>
            <div className="w-full">
              <label className="block">{texts[currentLang].password}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inter.className} bg-white rounded-xl h-10 mt-1 w-full px-3 py-2 border border-gray-400
                  shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent`}
              />
            </div>
          </div>
          <div className="flex justify-center md:pt-0 pt-20">
            <button 
              type="submit"
              className="lg:w-1/2 md:w-2/3 md:mt-10 2xl:mt-20 px-5 md:px-0 bg-[#012B55] text-white py-2 text-xl md:text-2xl 2xl:text-4xl rounded-4xl hover:bg-blue-800
                transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-opacity-50">
              {texts[currentLang].login}
            </button>
          </div>
          <div className="flex justify-center 2xl:px-10">
            <div className="text-center mt-8 xl:mt-15">
              <p className="text-2xl md:text-xl lg:text-2xl font-bold">
                {texts[currentLang].noAccount}
                <Link href="/registo" className="text-white underline hover:text-blue-800 font-medium">
                  {texts[currentLang].here}
                </Link>
                {texts[currentLang].required}
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}