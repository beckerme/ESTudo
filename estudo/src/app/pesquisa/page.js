"use client";

// 🛠️ Imports necessários para o componente principal
import { useEffect, useState, useCallback } from "react";         // 🎣 Hooks padrão do React para gerir estado e efeitos colaterais
import { useRouter } from 'next/navigation';                      // 🚀 Hook do Next.js para navegação programática
import HeaderInicioAdmin from "@/components/HeaderInicioAdmin";   // ⬆️ Cabeçalho para Admin
import HeaderInicioMod from "@/components/HeaderInicioMod";       // ⬆️ Cabeçalho para Moderador
import HeaderInicioAluno from "@/components/HeaderInicioAluno";   // ⬆️ Cabeçalho para Aluno
import BarraPesquisa from "@/components/BarraPesquisa";           // 🔍 Componente da barra de pesquisa (input)
import Tags from "@/components/Pesquisa/Tags";                    // 🏷️ Componente para exibir e interagir com tags
import supabase from "@/app/config/supabaseClient";               // 🔑 Configuração do cliente Supabase
import ListaDocumentos from "@/components/ListaDocumentos";       // 📄 Componente para a lista de documentos

// 🏡 Componente principal da página (Homepage/Página Inicial)
export default function App() {
  // 💾 Estados para gerenciar o tipo de utilizador, o termo de pesquisa, as tags e a tag selecionada
  const [tipoUsuario, setTipoUsuario] = useState("");             // Estado para armazenar o tipo de utilizador (admin, mod, aluno)
  const [termoPesquisa, setTermoPesquisa] = useState("");         // Estado para armazenar o texto digitado na barra de pesquisa
  const [tags, setTags] = useState([]);                           // Estado para armazenar a lista de tags buscadas do Supabase
  const [selectedTagId, setSelectedTagId] = useState("");         // Estado para armazenar o ID da tag atualmente selecionada para filtro
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);       // Indica se os documentos estão a ser carregados ⏳ (do Supabase)
  const [error, setError] = useState(null);                       // Armazena qualquer erro que ocorra na busca ❌
  const [documents, setDocuments] = useState([]);                 // Estado para armazenar os documentos encontrados 📄
  const [debouncedTermoPesquisa, setDebouncedTermoPesquisa] = useState(""); // Termo de pesquisa com debounce

  const router = useRouter();                                     // 🚀 Hook para permitir navegação no Next.js

  // 🕵️‍♂️ Efeito para carregar o tipo de utilizador do localStorage e procurar as tags na montagem
  useEffect(() => {
    if (typeof window !== "undefined") {
      const tipo = localStorage.getItem("tipoUsuario");
      setTipoUsuario(tipo);
      fetchTags();
      fetchDocuments(); // Carrega todos os documentos inicialmente
    }
  }, []);

  // ⏱️ Debounce effect para o termo de pesquisa
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTermoPesquisa(termoPesquisa);
    }, 400); // Aguarda 400ms após parar de escrever

    return () => clearTimeout(timer);
  }, [termoPesquisa]);

  // 🎣 useEffect para refazer a busca quando os filtros mudam (com debounce)
  useEffect(() => {
    // Só executa se o tipo de usuário já foi carregado
    if (tipoUsuario) {
      fetchDocuments();
    }
  }, [debouncedTermoPesquisa, selectedTagId, tipoUsuario]);

  // ⬇️ Função assíncrona para procurar a lista de tags na base de dados Supabase
  async function fetchTags() {
    const { data, error } = await supabase
      .from('document_tags')
      .select('id, designacao');

    if (error) {
      console.error("Erro ao buscar tags:", error);
    } else {
      setTags(data || []); // Define o estado `tags` com os dados recebidos (usa `|| []` para garantir que seja sempre um array) ✅
    }
  }

  // 📄 Função para buscar documentos (inicialmente todos, depois filtrados)
  const fetchDocuments = useCallback(async () => {
    setIsLoadingDocs(true);
    setError(null);

    try {
      // Inicia a query base no Supabase na tabela 'user_documents'
      let query = supabase.from('user_documents').select('*');

      // Aplica filtros se existirem
      if (debouncedTermoPesquisa.trim()) {
        query = query.ilike('name', `%${debouncedTermoPesquisa.trim()}%`);
      }
      
      if (selectedTagId) {
        query = query.eq('tag_id', selectedTagId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro no Supabase:", error);
        setError('Ocorreu um erro ao buscar os documentos.');
        setDocuments([]);
      } else {
        setDocuments(data || []);
      }
    } catch (err) {
      console.error("Erro na busca:", err);
      setError('Ocorreu um erro inesperado.');
      setDocuments([]);
    } finally {
      setIsLoadingDocs(false);
    }
  }, [debouncedTermoPesquisa, selectedTagId]);

  // 🖱️ Handler para quando uma tag é clicada no componente filho `Tags`.
  const handleTagChange = (tagId) => {
    setSelectedTagId(tagId);                                // 🔄 Atualiza o estado `selectedTagId` com o ID recebido
  };

  // ⏳ Renderização condicional inicial
  if (!tipoUsuario) {
    return <></>;
  }

  // 📝 Handler para quando o texto na BarraPesquisa muda.
  // Atualiza o estado `termoPesquisa` com o valor atual do input.
  const handleTermoPesquisaChange = (e) => {
    setTermoPesquisa(e.target.value);                         // Obtém o valor do campo de input e atualiza o estado
  };

  // 🚀 Handler principal para INICIAR a pesquisa (chamado ao clicar no botão de pesquisa ou pressionar Enter).
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
    if (params.toString()) {
      router.push(`/pesquisa?${params.toString()}`);
    }
  };

  // 🚫 Exibe uma mensagem de erro se um erro ocorreu durante a procura no Supabase
  if (error) return <div className="text-center p-4 text-red-500">Erro: {error}</div>;

  // Verifica se há pesquisa ativa (termo ou tag selecionada)
  const hasActiveSearch = debouncedTermoPesquisa.trim() || selectedTagId;

  // 🏗️ Estrutura de renderização da página inicial
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col">
      {/* ⬆️ Renderiza o cabeçalho correto com base no tipo de utilizador autenticado */}
      {tipoUsuario === "admin" && <HeaderInicioAdmin />}
      {tipoUsuario === "mod" && <HeaderInicioMod />}
      {tipoUsuario === "aluno" && <HeaderInicioAluno />}

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

        {/* 🔍 Exibe o termo de pesquisa se presente */}
        {termoPesquisa && (
          <div className="w-full text-center mt-4 text-lg text-gray-700">
            Resultados para: <span className="font-semibold">{termoPesquisa}</span>
          </div>
        )}

        {/* 📄 Lista de documentos - sempre visível */}
        <div className="w-full mt-10 flex justify-center">
          <div className="w-full max-w-4xl px-4">
            {/* ⏳ ENQUANTO procura os documentos no Supabase */}
            {isLoadingDocs ? (
              <>
              </>
            ) : (
              /* 📄 Resultados */
              documents.length > 0 ? (
                <ListaDocumentos termoPesquisa={debouncedTermoPesquisa} documents={documents}/>
              ) : (
                <div className="text-center text-gray-600 mt-8">
                  {hasActiveSearch ? (
                    <>
                      <p>Nenhum documento encontrado.</p>
                      <p className="mt-2 text-sm">Tente ajustar os filtros de pesquisa.</p>
                    </>
                  ) : (
                    <p>Não há documentos disponíveis.</p>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}