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
      <div className="flex justify-center">
        <Header />
      </div>
      <div className={`${kanit.className} flex flex-col md:flex-row justify-center min-h-screen gap-15 py-4 px-20`}>
        <div className="w-full md:w-2/3 h-128 bg-[#012B55] rounded-2xl flex items-center justify-center text-white shadow-lg px-30">
          <Saudacao />
        </div>
        <div className="w-full md:w-1/3 h-128 bg-[#28BCD3] rounded-2xl flex justify-center text-black text-xl shadow-lg">
          <LoginForm />
        </div>
      </div>
    </>
  );
}