"use client";

// 🛠️ Imports necessários para o componente principal
import { useEffect, useState } from "react";                      // 🎣 Hooks padrão do React para gerir estado e efeitos colaterais
import { useRouter } from 'next/navigation';                      // 🚀 Hook do Next.js para navegação programática
import HeaderInicioAdmin from "@/components/HeaderInicioAdmin";   // ⬆️ Cabeçalho para Admin
import HeaderInicioMod from "@/components/HeaderInicioMod";       // ⬆️ Cabeçalho para Moderador
import HeaderInicioAluno from "@/components/HeaderInicioAluno";   // ⬆️ Cabeçalho para Aluno
import BarraPesquisa from "@/components/BarraPesquisa";           // 🔍 Componente da barra de pesquisa (input)
import Tags from "@/components/Pesquisa/Tags";                    // 🏷️ Componente para exibir e interagir com tags
import supabase from "@/app/config/supabaseClient";               // 🔑 Configuração do cliente Supabase

// 🏡 Componente principal da página (Homepage/Página Inicial)
export default function App() {
  // 💾 Estados para gerenciar o tipo de utilizador, o termo de pesquisa, as tags e a tag selecionada
  const [tipoUsuario, setTipoUsuario] = useState("");             // Estado para armazenar o tipo de utilizador (admin, mod, aluno)
  const [termoPesquisa, setTermoPesquisa] = useState("");         // Estado para armazenar o texto digitado na barra de pesquisa
  const [tags, setTags] = useState([]);                           // Estado para armazenar a lista de tags buscadas do Supabase
  const [selectedTagId, setSelectedTagId] = useState("");         // Estado para armazenar o ID da tag atualmente selecionada para filtro

  const router = useRouter();                                     // 🚀 Hook para permitir navegação no Next.js

  // 🕵️‍♂️ Efeito para carregar o tipo de utilizador do localStorage e procurar as tags na montagem
  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");             // 💾 Lê o tipo de utilizador do armazenamento local (síncrono)
    setTipoUsuario(tipo);                                         // Define o estado do tipo de utilizador

    // 🏷️ Chama a função para procurar as tags do Supabase assim que o componente monta
    fetchTags();

    // O array de dependências vazio [] garante que este efeito só roda UMA VEZ, na montagem inicial.
  }, []);

    // ⬇️ Função assíncrona para procurar a lista de tags na base de dados Supabase
    async function fetchTags() {
      const { data, error } = await supabase
        .from('document_tags')
        .select('id, designacao');

      if (error) {
      } else {
        setTags(data || []); // Define o estado `tags` com os dados recebidos (usa `|| []` para garantir que seja sempre um array) ✅
      }
    }

    // 🖱️ Handler para quando uma tag é clicada no componente filho `FiltrarTags`.
    const handleTagChange = (tagId) => {
    setSelectedTagId(tagId);                                    // 🔄 Atualiza o estado `selectedTagId` com o ID recebido
};

  // ⏳ Renderização condicional inicial
  if (!tipoUsuario) {
    return;
  }

  // 📝 Handler para quando o texto na BarraPesquisa muda.
  // Atualiza o estado `termoPesquisa` com o valor atual do input.
  const handleTermoPesquisaChange = (e) => {
      setTermoPesquisa(e.target.value);                         // Obtém o valor do campo de input e atualiza o estado
  };

  // 🚀 Handler principal para INICIAR a pesquisa (chamado ao clicar no botão de pesquisa ou pressionar Enter).
  // O objetivo DESSA função é APENAS construir a URL e navegar para a página de resultados.
  const handleSearchSubmit = () => {
  const params = new URLSearchParams();                         // 🛠️ Cria um novo objeto para construir a query string da URL

  // ➕ Adiciona o termo de pesquisa (`q`) aos parâmetros APENAS se o termo não for vazio ou consistir apenas em espaços.
  if (termoPesquisa.trim()) {
    params.set('q', termoPesquisa.trim());
  }

  // ➕ Adiciona o ID da tag (`tagId`) aos parâmetros APENAS se um ID de tag estiver selecionado (não for string vazia).
  if (selectedTagId) {
      params.set('tagId', selectedTagId); 
  }

  // ➡️ Redireciona o utilizador para a página `/pesquisa`, anexando os parâmetros construídos na URL.
  // A página `/pesquisa` irá ler estes parâmetros e executar a procura no Supabase.
  router.push(`/pesquisa?${params.toString()}`);
};

  // 🏗️ Estrutura de renderização da página inicial
  return (
    // 📦 Container principal da página
    <div className="min-h-[calc(100vh-80px)] flex flex-col">
      {/* ⬆️ Renderiza o cabeçalho correto com base no tipo de utilizador autenticado */}
      {tipoUsuario === "admin" && <HeaderInicioAdmin />}
      {tipoUsuario === "mod" && <HeaderInicioMod />}
      {tipoUsuario === "aluno" && <HeaderInicioAluno />}
      {/* Se tipoUsuario for algo inesperado, nenhum cabeçalho específico será mostrado. */}

      {/* 🖥️ Área de conteúdo principal da página, centralizada */}
      <div className="flex flex-col items-center w-full px-4 py-6 my-auto">
        {/* 📄 Títulos principais da página */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">ESTudo</h1> 
          <p className="text-lg text-gray-700 mt-2">University Document-Sharing App</p>
        </div>

        {/* 🔍 Secção da Barra de Pesquisa */}
        <div className="mt-6">
          <BarraPesquisa
            type="search"
            onChange={handleTermoPesquisaChange}
            onSearch={handleSearchSubmit}
            value={termoPesquisa}
          />
        </div>

        {/* 🏷️ Secção do componente de Filtro por Tags */}
        <div>
          <Tags
             tags={tags}
             onTagChange={handleTagChange}
             activeTagId={selectedTagId}
          />
        </div>
      </div>
    </div>
  );
}