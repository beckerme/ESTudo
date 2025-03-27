import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ['latin'],
  weight: "400",
});

export default function LoginForm() {
    return (
        <>
            <div className="w-full max-w-md rounded-xl shadow-md overflow-hidden">

                <h1 className="text-6xl pt-12 text-center">Login</h1>
                <form className="px-8 py-10">
                    <div className="space-y-4">
                        <div className="w-full">
                            <label className="block">Email:</label>
                            <input 
                                type="email" 
                                className={`${inter.className} bg-white rounded-xl h-10 mt-1 w-full px-3 py-2 border border-gray-300 
                            shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent`}/>
                        </div>
                        <div className="w-full">
                            <label className="block">Password:</label>
                            <input 
                                type="password" 
                                className={`${inter.className} bg-white rounded-xl h-10 mt-1 w-full px-3 py-2 border border-gray-300 
                            shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent`}/>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button 
                            type="submit"
                            className="w-1/2 mt-13 bg-[#012B55] text-white py-2 rounded-4xl hover:bg-blue-800 transition duration-300 
                            ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-opacity-50"
                        >
                        Login
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <div className="w-2/3 text-center mt-5">
                            <p className="text-xl">Se não tiver ainda conta, registe-se<a href="#" className="text-white underline hover:text-blue-800 
                            ml-1 font-medium">aqui</a>!</p>
                        </div>
                    </div> 
                </form>
            </div>
        </>
    );
}