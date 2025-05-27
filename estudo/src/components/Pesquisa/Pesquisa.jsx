'use client';

// 🛠️ Imports necessários
import {useState, useEffect} from 'react'; // 🎣 Hooks para gerenciar estado e efeitos colaterais
import { useSearchParams } from 'next/navigation'; // 🗺️ Hook para obter parâmetros de busca da URL
import ListaDocumentos from "@/components/ListaDocumentos"; // 📄 Componente para exibir a lista de documentos
import supabase from "@/app/config/supabaseClient"; // 🔑 Configuração do cliente Supabase
import HeaderInicio from '../HeaderInicioAluno';

// 🚀 Componente principal para a página de resultados de pesquisa
export default function Pesquisa() {
    // Obtém os parâmetros de procura da URL ✨
    const searchParams = useSearchParams();
    const termoPesquisa = searchParams.get('q') || '';              // Obtém o termo da query de procura ('q'), padrão é string vazia
    const tagId = searchParams.get('tagId');                        // Obtém o ID da tag ('tagId') da URL

    // 💾 Variáveis de estado para gerir dados, carregamento e erros
    const [documents, setDocuments] = useState(null);               // Armazena os documentos encontrados pela query do Supabase
    const [isLoadingDocs, setIsLoadingDocs] = useState(true);       // Indica se os documentos estão a ser carregados ⏳ (do Supabase)
    const [error, setError] = useState(null);                       // Armazena qualquer erro que ocorra na busca ❌

// 🎣 Hook useEffect para encontrar os dados no Supabase com base nos parâmetros de pesquisa da URL
useEffect(() => {
    async function searchDocuments() {
        setIsLoadingDocs(true);                                     // Inicia o carregamento ao começar a busca ⏳
        setError(null);                                             // Limpa quaisquer erros anteriores

        // 🛠️ Inicia a query base no Supabase na tabela 'user_documents' selecionando todos os campos
        let query = supabase.from('user_documents').select('*');

        // 🚦 Lógica otimizada para combinar filtros de termo de pesquisa e tag
        const hasTermo = !!termoPesquisa;                           // Verifica se o termo de pesquisa existe e não é vazio
        const hasTag = !!tagId;                                     // Verifica se o ID da tag existe e não é vazio

        if (hasTermo && hasTag) {
            query = query
                .ilike('name', `%${termoPesquisa}%`)
                .eq('tag_id', tagId);
        } else if (hasTermo) {
            query = query.ilike('name', `%${termoPesquisa}%`);      // Filtra apenas pelo nome
        } else if (hasTag) {
            query = query.eq('tag_id', tagId);                      // Filtra apenas pelo ID da tag
        }

        // 🏃 Executa a query construída
        const { data, error } = await query;

        // ❗ Lida com erros durante a procura no Supabase
        if (error) {
            console.error("Erro no Supabase:", error); // Log para depuração
            setError('Ocorreu um erro ao buscar os documentos.');   // Mensagem de erro para o utilizador
            setDocuments([]);                                       // Define documentos como um array vazio em caso de erro
        } else {
            setDocuments(data || []);                               // Define os dados encontrados (ou array vazio se data for null/undefined) ✅
        }
        setIsLoadingDocs(false);                                    // Finaliza o carregamento ✅
    }
    searchDocuments();                                              // Chama a função assíncrona para iniciar a busca

    // ▶️ Array de dependência: executa este efeito novamente sempre que o termo de pesquisa ou o ID da tag mudar na URL
    }, [termoPesquisa, tagId]);

  // 🚫 Exibe uma mensagem de erro se um erro ocorreu durante a procura no Supabase
  if (error) return <div className="text-center p-4 text-red-500">Erro: {error}</div>;


    return (
        <>
            {/* ⬆️ Componente do cabeçalho */}
            <div>
                <HeaderInicio />
            </div>

            {/* 📦 Container principal do conteúdo, flex column */}
            <div className="min-h-[calc(100vh-80px)] flex flex-col">
                 {/* Conteúdo principal */}
                {/* Área de conteúdo centralizada */}
                <div className="flex flex-col items-center w-full px-4 py-6 my-auto">
                    {/* 🔍 Exibe o termo de pesquisa se presente */}
                    {termoPesquisa && (
                        <div className="w-full text-center mt-4 text-lg text-gray-700">
                            Resultados para: <span className="font-semibold">{termoPesquisa}</span> {/* Destaca o termo */}
                        </div>
                    )}

                    {/* ⏳ Exibe indicador de carregamento ENQUANTO procura os documentos no Supabase */}
                    {isLoadingDocs ? (
                        <div></div>
                    ) : (
                        // 📄 Container para a lista de documentos (só renderiza APÓS a carga inicial do Supabase terminar)
                        <div className="w-full mt-10 flex justify-center">
                            <div className="w-full max-w-4xl px-4">
                                {/* 📜 Passa os documentos encontrados e o termo de pesquisa para ListaDocumentos */}
                                <ListaDocumentos documents={documents} termoPesquisa={termoPesquisa}/>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}