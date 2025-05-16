 // ✒️ Importa a fonte Kanit do Google Fonts
import { Kanit } from "next/font/google";

// ⚙️ Configuração da fonte Kanit: subset 'latin' e peso '400'
const kanit = Kanit({
  subsets: ['latin'],
  weight: "400",
});

// 🔍 Componente BarraPesquisa: um campo de input para pesquisa
// Aceita as props `onChange` (para mudanças no texto) e `onSearch` (para ação de pesquisa, e.g., Enter)
export const BarraPesquisa = ({ onChange, onSearch }) => {

  // ⌨️ Função para lidar com a pressão de teclas no input
  const handleKeyPress = (event) => {
    // Se a tecla pressionada for 'Enter' E a prop onSearch existir...
    if (event.key === 'Enter' && onSearch) {
      onSearch();                                                                             // 🚀 Chama a função onSearch fornecida pela prop
    }
  };

  return (
    <input
      className={`bg-[#007CC2] rounded-3xl w-[49vw] h-[6vh] px-3
                  placeholder:text-white text-white placeholder:${kanit.className}`} 
      placeholder="Pesquise por apontamentos"                                                 // ✍️ Texto placeholder
      onChange={onChange}                                                                     // 🔄 Chama a função onChange quando o texto muda
      onKeyDown={handleKeyPress}                                                              // 👇 Chama handleKeyPress quando uma tecla é pressionada
      type="search"                                                                           // ℹ️ Tipo de input semântico para campos de pesquisa
    />
  );
};

export default BarraPesquisa;                                                                 // 📦 Exporta o componente por padrão