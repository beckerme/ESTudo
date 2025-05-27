'use client';

// 🛠️ Imports necessários
import { useEffect, useState } from "react";                        // 🎣 Hooks para gerenciar estado e efeitos colaterais
import supabase from "../app/config/supabaseClient";                // 🔑 Configuração do cliente Supabase (Verificar o caminho, como sugeriu)
// import PDFViewer from "./PdfViewer";                             // 📄 Componente para exibir PDFs - Removido pois a lógica de visualização agora usa router.push
import { useRouter } from "next/navigation";                        // 🚀 Hook para navegação no Next.js

// Componente que lista documentos recebidos via props e aplica filtragem adicional por termo de pesquisa.
// Exibe mensagens de estado diferentes dependendo se está a carregar, se não encontrou documentos
// após a filtragem, ou se há documentos para mostrar.
export default function ListaDocumentos({ documents: propDocuments, termoPesquisa = "" }) {
  
  // 🔐 Estados para gerenciar a sessão do utilizador
  const [sessionLoading, setSessionLoading] = useState(true);       // Indica se a sessão está a ser verificada ⏳
  const [sessionError, setSessionError] = useState(null);           // Armazena erros na verificação da sessão ❌
  const [user, setUser] = useState(null);                           // Armazena o objeto do utilizador autenticado 👨🏻‍🦱
  const router = useRouter();                                       // Instância do router para navegação 🚀

  // 🚦 Estado para controlar se os documentos iniciais já foram carregados pelo componente pai
  // Este estado ajuda a distinguir entre 'ainda a carregar' e 'carregado mas sem resultados'.
  const [hasLoadedInitially, setHasLoadedInitially] = useState(false);

  // Textos multilíngues para o botão Visualizar e notificações
  const texts = {
    pt: {
      view: "Visualizar",
      author: "Autor",
      unknown: "Desconhecido",
      createdAt: "Criado em",
      notFound: "Nenhum documento encontrado com os critérios de pesquisa.",
      sessionError: "Erro de sessão:",
      notAuthenticated: "Utilizador não autenticado. A redirecionar para o login..."
    },
    en: {
      view: "View",
      author: "Author",
      unknown: "Unknown",
      createdAt: "Created at",
      notFound: "No documents found with the search criteria.",
      sessionError: "Session error:",
      notAuthenticated: "User not authenticated. Redirecting to login..."
    }
  };
  const [currentLang, setCurrentLang] = useState("pt");
  useEffect(() => {
    const lang = localStorage.getItem("lang") || "pt";
    setCurrentLang(lang);
    const onLangChange = (e) => {
      if (e.detail && e.detail.lang) setCurrentLang(e.detail.lang);
    };
    window.addEventListener("langChange", onLangChange);
    return () => window.removeEventListener("langChange", onLangChange);
  }, []);

  // 🕵️‍♂️ Efeito para verificar a sessão do utilizador ao montar o componente. ESSENCIAL para acesso protegido.
  useEffect(() => {
    const checkSession = async () => {
      setSessionLoading(true);                                      // Inicia o carregamento da sessão ⏳
      setSessionError(null); // Limpa erros anteriores
      try {
        // Tenta obter a sessão atual do Supabase 🔑
        const { data: { session }, error: supabaseSessionError } = await supabase.auth.getSession();

        if (supabaseSessionError) throw supabaseSessionError; // Lança erro se o Supabase reportar um problema

        // Se não houver sessão ou utilizador na sessão, redireciona 🚪
        if (!session || !session.user) {
          router.push('/login');                                    // ➡️ Redireciona o utilizador para a página de login
          // Nota: Não precisa definir sessionLoading(false) aqui, pois o router.push interrompe a execução.
          return; // Sai da função checkSession
        }
        setUser(session.user);                                      // Define o utilizador autenticado ✅
      } catch (err) {
        setSessionError(err.message || "Ocorreu um erro ao verificar a sessão."); // Define o estado de erro de sessão
      } finally {
        // Este finally pode ser omitido se o router.push ocorrer, mas é útil se a lógica mudar
        // ou para garantir que o estado sessionLoading é definido para false em outros casos de erro
        // onde não há throw síncrono antes do finally. Manter por robustez.
        setSessionLoading(false);                                   // Finaliza o carregamento da sessão independentemente do resultado ✅
      }
    };

    checkSession();                                                 // 🕵️‍♂️ Executa a função de verificação da sessão ao montar o componente
  }, [router]);                                                     // ▶️ Dependência no objeto router para garantir que o efeito é compatível com o Next.js

  // 🆕 NOVO EFEITO: Marca quando propDocuments deixa de ser null/undefined pela primeira vez
  // ⏳ Isto é crucial para distinguir o estado "A Carregar Documentos" (no componente pai)
  // do estado "Nenhum Documento Encontrado com este filtro" (neste componente, após a carga).
  useEffect(() => {
      // Só define hasLoadedInitially para true SE propDocuments deixar de ser null/undefined
      // E AINDA NÃO TIVER SIDO DEFINIDO (para correr apenas na primeira carga de dados).
      if (propDocuments !== null && typeof propDocuments !== 'undefined' && !hasLoadedInitially) {
          setHasLoadedInitially(true);                              // Marca que a carga inicial de documentos (pelo pai) aconteceu ✅
      }
      // Dependências: propDocuments para reagir quando o pai passar os dados,
      // hasLoadedInitially para garantir que só marca como "carregado inicialmente" uma vez.
  }, [propDocuments, hasLoadedInitially]);

  // 🖼️ Função para visualizar um documento: obtém uma URL assinada do Supabase Storage e redireciona para a página de visualização.
  const visualizarDocumento = async (documento) => {
    try {
      const filePath = documento.name;                              // Assume que o caminho no storage é o nome do ficheiro no banco de dados
      // 🔑 Pede uma URL assinada ao Supabase Storage para o ficheiro especificado
      const { data, error } = await supabase
        .storage
        .from('documentos')                                         // 📦 Especifica o bucket de storage onde os documentos estão guardados
        .createSignedUrl(filePath, 3600);                           // ⏱️ Cria uma URL que expira em 3600 segundos (1 hora)

      if (error) {
          throw new Error(`Não foi possível gerar a URL para o ficheiro: ${error.message}`);
      }

      // ➡️ Redireciona o utilizador para a página de consulta, passando a URL assinada e metadados como parâmetros de query.
      router.push(`/consultar-doc?pdf=${encodeURIComponent(data.signedUrl)}&titulo=${encodeURIComponent(documento.name)}&autor=${encodeURIComponent(documento.author || 'N/A')}`);

    } catch (err) {
      alert(`Erro ao tentar abrir o documento: ${err.message}`);    // 🚨 Exibe um alerta simples para o utilizador com a mensagem de erro
    }
  };

  // 🔍 Filtra os documentos recebidos via prop 'propDocuments' com base no 'termoPesquisa' (case-insensitive) no nome ou autor.
  const documentosFiltradosCliente = (propDocuments || []).filter((doc) => {
    
    // Converte o termo de pesquisa para minúsculas, se existir
    // Se não, todos os documentos são incluídos
    const termo = termoPesquisa ? termoPesquisa.toLowerCase() : "";
    if (!termo) return true;

    // 📝 Verifica se o termo (em minúsculas) está incluído no nome (em minúsculas) OU no autor (em minúsculas)
    const nameMatch = doc.name && doc.name.toLowerCase().includes(termo); 
    const authorMatch = doc.author && doc.author.toLowerCase().includes(termo);
    return nameMatch || authorMatch;
  });

  // --- Lógica de Renderização Condicional Atualizada ---
  // 🎛️ Controla o que é mostrado ao utilizador com base nos diferentes estados da aplicação.

  // 1. ⏳ Estado de carregamento da sessão Supabase: Mostra nada ou um spinner enquanto verifica a autenticação.
  if (sessionLoading) {
    return null; // Poderia ser um spinner de ecrã inteiro 🔄
  }

  // 2. ❌ Estado de erro na verificação da sessão: Exibe uma mensagem de erro de sessão.
  if (sessionError) {
    return <div className="text-center p-4 text-red-500">{texts[currentLang].sessionError} {sessionError}</div>;
  }

  // 3. 🚫 Estado de utilizador não autenticado (fallback): Caso o redirecionamento falhe ou demore, mostra uma mensagem.
  if (!user) {
    return <div className="text-center p-4">{texts[currentLang].notAuthenticated}</div>;
  }

  // 4. ⏳ Estado de carregamento inicial dos documentos pelo pai:
  //    Se `hasLoadedInitially` ainda for `false`, significa que `propDocuments` ainda não recebeu o array de dados do pai.
  //    Neste cenário, o componente pai é responsável por mostrar o seu próprio indicador de loading (isLoadingDocs).
  //    Este componente ListaDocumentos simplesmente retorna null ou outro placeholder enquanto espera os dados.
   if (!hasLoadedInitially) {
      return null; // Retorna null enquanto espera propDocuments ser populado pela primeira vez
   }

  // 5. 🤷‍♀️ Estado após a carga inicial, quando a lista FILTRADA localmente está vazia:
  //    Isso acontece se:
  //    - Os dados do pai vieram vazios (`propDocuments` era `[]`).
  //    - OU os dados do pai vieram com itens, mas nenhum deles correspondeu ao `termoPesquisa`
  //      durante a filtragem feita NESTE componente.
  if (documentosFiltradosCliente.length === 0) {
    return (
        <div className="text-center p-4 text-gray-600 w-full max-w-4xl">
            {texts[currentLang].notFound}
        </div>
    );
  }

  // 6. ✅ Estado final: Há documentos na lista FILTRADA localmente para exibir.
  //    Renderiza a lista de documentos filtrados.
  return (
    <div className="flex flex-col items-center w-full">
        <div className="space-y-4 w-full max-w-3xl px-4 md:px-0">
            {/* 🗺️ Mapeia sobre a lista de documentos filtrados (`documentosFiltradosCliente`) para exibir cada um */}
             {/* 🪪 Cartão do Documento: Estrutura para exibir as informações de cada documento */}
            {documentosFiltradosCliente.map((doc) => (
              <div
                key={doc.id} // 🔑 Chave única e obrigatória para cada item numa lista no React
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200" // Estilos do cartão do documento
              >
                {/* Flex container para alinhar conteúdo e botão */}
                <div className="flex justify-between items-start">
                  {/* 📝 Área de texto do documento (nome, autor, data) */}
                  <div className="flex-1 mr-4 min-w-0"> {/* flex-1 permite que ocupe o espaço disponível, min-w-0 previne overflow */}
                    <h2 className="text-lg font-semibold text-gray-900 mb-1 truncate" title={doc.name}>
                      {doc.name || "Documento sem nome"}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">
                      {texts[currentLang].author}: {doc.author || texts[currentLang].unknown}
                    </p>
                    <p className="text-xs text-gray-500">
                      {texts[currentLang].createdAt}: {new Date(doc.created_at).toLocaleDateString(currentLang === 'pt' ? 'pt-PT' : 'en-US')}
                    </p>
                  </div>
                  {/* 👁️ Botão de Visualizar o Documento */}
                  <button
                    onClick={() => visualizarDocumento(doc)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md
                              transition-colors flex-shrink-0 text-sm flex items-center gap-2"
                  >
                    <span>📄</span> {texts[currentLang].view}
                  </button>
                </div>
              </div>
            ))}
        </div>
    </div>
  );
}