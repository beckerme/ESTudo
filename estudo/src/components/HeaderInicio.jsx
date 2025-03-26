function Header() {
    return (
      <header >
        <div 
        className="bg-white flex items-center justify-between px-4 py-2 rounded-bl-[40px] rounded-br-[40px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
          {/* Ícone de Perfil */}
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            {/* Coloque aqui a imagem do perfil */}
          </div>
  
          {/* Logo Central */}
          <div className="w-12 h-12">
            <img src="/logo.png"></img>
          </div>
  
          {/* Ícones à Direita */}
          <div className="flex items-center gap-4">
            {/* Ícone de Notificação */}
            <div className="relative">
              <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full"></span>
              {/* Coloque aqui o ícone de sino */}
            </div>
  
            {/* Bandeira de Portugal */}
            <div className="w-8 h-5 rounded-md overflow-hidden">
              {/* Coloque aqui a bandeira */}
            </div>
          </div>
        </div>
      </header>
    );
  }
  
  export default Header;