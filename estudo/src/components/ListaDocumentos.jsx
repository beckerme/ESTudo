import { useEffect, useState } from "react";
import supabase from "../app/config/supabaseClient";
import PDFViewer from "./PdfViewer";

export default function ListaDocumentos() {
  const [documentos, setDocumentos] = useState([]);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        if (!session) return router.push('/login');
  
        setUser(session.user);
        fetchDocs();
      } catch (err) {
        setError(err.message || "Erro na sessão");
        setLoading(false);
      }
    };
  
    checkSession();
  }, []);

  // Função modificada para buscar todos os documentos
  const fetchDocs = async () => {
    try {
      setLoading(true);
      
      const { data: documents, error: docsError } = await supabase
        .from("user_documents")
        .select('*')
        .order('created_at', { ascending: false });
  
      if (docsError) throw docsError;
  
      setDocumentos(documents);
      
    } catch (err) {
      console.error("Erro completo:", {
        message: err.message,
        code: err.code,
        details: err.details
      });
      setError("Falha ao carregar dados: " + err.message);
    } finally {
      setLoading(false);
    }
  };
  

  const visualizarDocumento = async (documento) => {
    try {
      // Caminho direto na raiz do bucket
      const filePath = documento.name;
      
      // Verificação de existência
      const { data: fileList, error: listError } = await supabase
        .storage
        .from('documentos')
        .list();
  
      if (listError) throw listError;
  
      if (!fileList.some(file => file.name === documento.name)) {
        throw new Error("Arquivo não encontrado no repositório");
      }
  
      // Obter URL assinada
      const { data, error } = await supabase
        .storage
        .from('documentos')
        .createSignedUrl(filePath, 3600);
  
      if (error) throw error;
  
      setPdfUrl(data.signedUrl);
    } catch (err) {
      console.error("Erro detalhado:", err);
      alert(`Erro ao abrir: ${err.message}`);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!user) return <div>Por favor, faça login para acessar os documentos</div>;

// Modifique o JSX para:
return (
  <div>
    <h1>Documentos Compartilhados</h1>
    {documentos.length === 0 ? (
      <p>Nenhum documento encontrado</p>
    ) : (
      <div className="document-list">
        {documentos.map((doc) => (
          <div key={doc.id} className="document-item">
            <div>
              <h3>{doc.name}</h3>
              <p>Autor: {doc.user_email}</p>
              <small>
                {new Date(doc.created_at).toLocaleDateString()}
              </small>
            </div>
            <button 
              onClick={() => visualizarDocumento(doc)}
              className="view-button"
            >
              📄 Visualizar
            </button>
          </div>
        ))}
      </div>
    )}

    {pdfUrl && (
      <div className="pdf-container">
        <PDFViewer url={pdfUrl} />
      </div>
    )}
  </div>
);
}