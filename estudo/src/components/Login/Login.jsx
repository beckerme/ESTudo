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
        <div className="grid grid-cols-1 md:grid-cols-[65%_35%] 2xl:space-x-23 lg:space-x-10 md:space-x-5 md:space-y-0 space-y-10 mx-6 mt-5 2xl:mt-15">
          
          {/* Coluna de Saudação */}
          <div className="bg-[#012B55] p-6 md:px-0 rounded-2xl shadow-md items-center flex">
            <Saudacao />
          </div>
          
          {/* Coluna do Formulário de Login */}
          <div className="bg-[#28BCD3] p-6 pt-15 rounded-2xl shadow-md">
            <h2 className="text-5xl 2xl:text-6xl md:py-0
            text-black text-center md:mb-6">Login</h2>
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
}