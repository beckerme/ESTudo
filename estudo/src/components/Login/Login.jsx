import { Kanit } from "next/font/google";
import Header from "./Header";
import Saudacao from "./Saudacao";
import LoginForm from "./LoginForm";

const kanit = Kanit({
  subsets: ['latin'],
  weight: "400",
});

export default function Login() {
  return (
    <>
      {/* Logótipo */}
      <div className={`${kanit.className} container mx-auto px-4 py-1`}>
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-[65%_35%] space-x-23 mx-auto">
          
          {/* Coluna de Saudação */}
          <div className="bg-[#012B55] p-6 rounded-lg shadow-md">
            <Saudacao />
          </div>
          
          {/* Coluna do Formulário de Login */}
          <div className="bg-[#28BCD3] p-6 rounded-lg shadow-md">
            <h2 className="text-6xl mb-25
            text-black text-center">Login</h2>
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
}