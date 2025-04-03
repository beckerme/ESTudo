import Image from "next/image";

export default function HeaderInicio() {
    return (
      <header >
        <div 
        className="w-full h-[80px] bg-white flex items-center justify-between px-10 rounded-bl-[40px] rounded-br-[40px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
          {/* Ícone de Perfil */}

          { /* TODO Mudar as imagens de perfil consoante o tipo de utilizador */}
          <div className="w-12 h-12 flex items-center justify-center">
          <Image src="/user.png" width={80} height={80} alt="foto do utilizador" />
          </div>
  
          {/* Logo Central */}
          <div className="w-12 h-12">
            <a href="pag-inicial"><Image src="/logo.png" width={80} height={80} alt="logotipo aplicação" /></a>
          </div>
  
          {/* Ícones à Direita */}
          <div className="flex items-center gap-4">
            {/* Ícone de Notificação */}
            <div className="relative">
              <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full"></span>
              <Image src="/notification.png" width={30} height={30} alt="sino de notificações" />
            </div>
  
            {/* Bandeira de Portugal */}
            <div className="flex w-8 h-12 items-center rounded-md overflow-hidden">
              <Image src="/bandeira_portugal.png" width={100} height={100} alt="bandeira de Portugal" />
            </div>
          </div>
        </div>
      </header>
    );
  }