import { Kanit } from "next/font/google";
const kanit = Kanit({
    subsets: ['latin'],
    weight: "400",
  });

export const Input = () =>{
    return <input 
            className={`bg-[#007CC2] rounded-3xl w-[49vw] h-[6vh] px-3 placeholder:text-white placeholder:${kanit.className}`}
            placeholder="Pesquise por apontamentos"/>
}

export default Input;