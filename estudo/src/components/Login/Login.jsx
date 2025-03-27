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
    <div className={kanit.className}>
      <Header />
      <div className="flex items-center justify-center">
        <Saudacao />
        <div className="w-[450px] h-[730px] rounded-3xl ml-[90px] bg-[#28BCD3]">
          <LoginForm />
        </div>
      </div>
      
    </div>
  );
}