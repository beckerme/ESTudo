import { Kanit } from "next/font/google";

export const Input = () =>{
    return <input 
            className="bg-[#007CC2] rounded-3xl w-[20rem] h-[4rem] px-3 placeholder:text-white placeholder:Kanit"
            placeholder="Pesquise por apontamentos" />
}

export default Input;