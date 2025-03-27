export default function LoginForm() {
    return (
        <>
            {/*Div Palavra Login */}
            <div className="mt-[80px] text-black">
                <h1 className="text-center text-[64px] mb-[60px]">Login</h1>
            </div>

            {/*Form Login */}
            <div className="mx-[51px]">
                <label className="text-4xl">Email:</label><br></br>
                <input 
                    type="text" className="mt-2 px-[10px] bg-white w-[350px] h-[40px] rounded-[10px]" 
                />
            </div>
            <div className="mx-[51px] mt-[40px]">
                <label className="text-4xl">Password:</label><br></br>
                <input 
                    type="password" className="mt-2 px-[10px] bg-white w-[350px] h-[40px] rounded-[10px]" />
            </div>

            {/*Botão Login */}
            <div className="mt-[71px] flex justify-center">
                <a href="pag-inicial" className="block">
                    <button type="button" className="text-4xl text-white mt-2 px-[10px] bg-[#012B55] w-[194px] h-[55px] rounded-[100px] cursor-pointer">
                        Login
                    </button>
                </a>
            </div>

            {/*Div Registo */}
            <div className="text-center h-[58px] mx-[75px] mt-[40px]">
                <p className="text-2xl">Se ainda não tiver conta, registe-se <a href="registo" className="text-[#FFFFFF] underline">aqui</a>!</p>
            </div>
          </>
    );
}