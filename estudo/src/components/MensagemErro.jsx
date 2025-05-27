"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Kanit } from "next/font/google";

const kanit = Kanit({
    subsets: ['latin'],
    weight: "400",
  });

export default function PaginaComRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("pag-inicial"); 
    }, 2000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={kanit.className}>
        <div className="justify-center xl:py-2 py-4 mt-3 flex items-center min-h-screen">
            <div className="flex items-center space-x-4"> 
                {/* Mensagem */}
                <div className="bg-[#fff] px-6 py-10 rounded-2xl shadow-md outline-2 outline-gray-600 p-4">
                    <p className="lg:text-md flex justify-center">Não tem acesso a esta página</p>
                    <p className="lg:text-md">Vai ser redirecionado para a página inicial</p>
                </div>
            </div>
        </div>
    </div>
  );
}
