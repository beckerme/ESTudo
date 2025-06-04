export default function Saudacao({ currentLang = "pt" }) {
  const texts = {
    pt: {
      welcome: "Bem vindo à ESTudo!",
      subtitle: "Uma aplicação de partilha de documentos inovadora!"
    },
    en: {
      welcome: "Welcome to ESTudo!",
      subtitle: "An innovative document sharing app!"
    }
  };
  return (
    <>
      {/* Coluna da Saudação */}
      <div className="w-full h-auto leading-snug p-3 md:p-8 lg:p-10 2xl:p-15  md:text-5xl lg:text-5xl text-2xl text-white text-center flex 
        items-center flex-col justify-center">
        <h1 className="pb-20 font-bold">{texts[currentLang].welcome}</h1>
        <p>{texts[currentLang].subtitle}</p>
      </div>
    </>
  );
}