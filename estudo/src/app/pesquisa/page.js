"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from 'next/navigation';
import HeaderInicioAdmin from "@/components/HeaderInicioAdmin";
import HeaderInicioMod from "@/components/HeaderInicioMod";
import HeaderInicioAluno from "@/components/HeaderInicioAluno";
import BarraPesquisa from "@/components/BarraPesquisa";
import Tags from "@/components/Pesquisa/Tags";
import supabase from "@/app/config/supabaseClient";
import ListaDocumentos from "@/components/ListaDocumentos";

export default function App() {
  // 1. Todos os Hooks devem ser declarados incondicionalmente no topo
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [tipoUsuario, setTipoUsuario] = useState("");
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTagId, setSelectedTagId] = useState("");
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [debouncedTermoPesquisa, setDebouncedTermoPesquisa] = useState("");
  const [currentLang, setCurrentLang] = useState("pt");

  // 2. Efeito para verificação de autorização
  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");
    setTipoUsuario(tipo || "");

    if (tipo !== "admin") {
      setAutorizado(true);
    } else {
      setAutorizado(false);
      router.push("/mensagem-erro");
    }
    setLoadingAuth(false);
  }, [router]);

  // 3. Textos (não é um Hook, pode ficar aqui)
  const texts = {
    pt: {
      appTitle: "ESTudo",
      appSubtitle: "Aplicação Universitária de Partilha de Documentos",
      searchResults: "Resultados para:",
      noDocsFound: "Nenhum documento encontrado.",
      tryAdjustFilters: "Tente ajustar os filtros de pesquisa.",
      noDocsAvailable: "Não há documentos disponíveis.",
      error: "Erro: ",
      searchPlaceholder: "Pesquise por apontamentos",
      allCategories: "Todas as Categorias"
    },
    en: {
      appTitle: "ESTudo",
      appSubtitle: "University Document-Sharing App",
      searchResults: "Results for:",
      noDocsFound: "No documents found.",
      tryAdjustFilters: "Try adjusting the search filters.",
      noDocsAvailable: "No documents available.",
      error: "Error: ",
      searchPlaceholder: "Search for notes",
      allCategories: "All Categories"
    }
  };

  // 4. Outros efeitos
  useEffect(() => {
    const lang = localStorage.getItem("lang") || "pt";
    setCurrentLang(lang);
    const onLangChange = (e) => {
      if (e.detail && e.detail.lang) setCurrentLang(e.detail.lang);
    };
    window.addEventListener("langChange", onLangChange);
    return () => window.removeEventListener("langChange", onLangChange);
  }, []);

  useEffect(() => {
    if (!loadingAuth && autorizado) {
      fetchTags();
      fetchDocuments();
    }
  }, [loadingAuth, autorizado]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTermoPesquisa(termoPesquisa);
    }, 400);
    return () => clearTimeout(timer);
  }, [termoPesquisa]);

  useEffect(() => {
    if (tipoUsuario && autorizado) {
      fetchDocuments();
    }
  }, [debouncedTermoPesquisa, selectedTagId, tipoUsuario, autorizado]);

  // 5. Funções auxiliares
  async function fetchTags() {
    const { data, error } = await supabase.from('document_tags').select('id, designacao');
    if (error) {
      console.error("Erro ao buscar tags:", error);
    } else {
      setTags(data || []);
    }
  }

  const fetchDocuments = useCallback(async () => {
    if (!autorizado) return;
    
    setIsLoadingDocs(true);
    setError(null);
    try {
      let query = supabase.from('user_documents').select('*');
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
  }, [debouncedTermoPesquisa, selectedTagId, autorizado]);

  const handleTagChange = (tagId) => {
    setSelectedTagId(tagId);
  };

  const handleTermoPesquisaChange = (e) => {
    setTermoPesquisa(e.target.value);
  };

  const handleSearchSubmit = () => {
    const params = new URLSearchParams();
    if (termoPesquisa.trim()) {
      params.set('q', termoPesquisa.trim());
    }
    if (selectedTagId) {
      params.set('tagId', selectedTagId); 
    }
    if (params.toString()) {
      router.push(`/pesquisa?${params.toString()}`);
    }
  };

  // 6. Renderização condicional (após todos os Hooks)
  if (loadingAuth) {
    return null; // Ou um spinner de carregamento
  }

  if (!autorizado) {
    return null;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{texts[currentLang].error}{error}</div>;
  }

  const hasActiveSearch = debouncedTermoPesquisa.trim() || selectedTagId;

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col">
      {tipoUsuario === "admin" && <HeaderInicioAdmin />}
      {tipoUsuario === "mod" && <HeaderInicioMod />}
      {tipoUsuario === "aluno" && <HeaderInicioAluno />}

      <div className="flex flex-col items-center w-full px-4 py-6 my-auto">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{texts[currentLang].appTitle}</h1> 
          <p className="text-lg text-gray-700 mt-2">{texts[currentLang].appSubtitle}</p>
        </div>

        <div className="mt-6">
          <BarraPesquisa
            type="search"
            onChange={handleTermoPesquisaChange}
            onSearch={handleSearchSubmit}
            value={termoPesquisa}
            placeholder={texts[currentLang].searchPlaceholder}
          />
        </div>

        <div>
          <Tags
            tags={tags}
            onTagChange={handleTagChange}
            activeTagId={selectedTagId}
            allCategoriesLabel={texts[currentLang].allCategories}
          />
        </div>

        {termoPesquisa && (
          <div className="w-full text-center mt-4 text-lg text-gray-700">
            {texts[currentLang].searchResults} <span className="font-semibold">{termoPesquisa}</span>
          </div>
        )}

        <div className="w-full mt-10 flex justify-center">
          <div className="w-full max-w-4xl px-4">
            {isLoadingDocs ? (
              <></>
            ) : (
              documents.length > 0 ? (
                <ListaDocumentos termoPesquisa={debouncedTermoPesquisa} documents={documents}/>
              ) : (
                <div className="text-center text-gray-600 mt-8">
                  {hasActiveSearch ? (
                    <>
                      <p>{texts[currentLang].noDocsFound}</p>
                      <p className="mt-2 text-sm">{texts[currentLang].tryAdjustFilters}</p>
                    </>
                  ) : (
                    <p>{texts[currentLang].noDocsAvailable}</p>
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