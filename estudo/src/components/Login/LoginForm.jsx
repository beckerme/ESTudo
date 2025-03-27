import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ['latin'],
  weight: "400",
});

export default function LoginForm() {
    return (
        <>
            <div className="w-full max-w-2xl rounded-xl overflow-hidden">
                <form className="px-8 py-10 w-full">
                    <div className="space-y-4">
                        <div className="w-full">
                            <label className="block">Email:</label>
                            <input 
                                type="email" 
                                className={`${inter.className} bg-white rounded-xl h-10 mt-1 w-full px-3 py-2 border border-gray-400 
                            shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent`}/>
                        </div>
                        <div className="w-full">
                            <label className="block">Password:</label>
                            <input 
                                type="password" 
                                className={`${inter.className} bg-white rounded-xl h-10 mt-1 w-full px-3 py-2 border border-gray-400 
                            shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent`}/>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button className="w-1/2 mt-18 bg-[#012B55] text-white py-2 text-4xl rounded-4xl hover:bg-blue-800 
                        transition duration-300 
                            ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-opacity-50">
                        <a href="/pag-inicial"
                            type="submit"
                        >
                        Login
                        </a>
                        </button>
                    </div>
                    <div className="flex justify-center px-10">
                        <div className="text-center mt-18">
                            <p className="text-2xl font-bold">Se não tiver ainda conta, registe-se<a href="/registo" className="text-white underline hover:text-blue-800 
                            ml-1 font-medium">aqui</a>!</p>
                        </div>
                    </div> 
                </form>
            </div>
        </>
    );
}