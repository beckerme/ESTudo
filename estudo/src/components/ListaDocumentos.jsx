'use client';

import { useEffect, useState } from "react";
import supabase from "../app/config/supabaseClient";
import PDFViewer from "./PdfViewer";
import { useRouter } from "next/navigation";

export default function ListaDocumentos({ termoPesquisa = "" }) {
  const [documentos, setDocumentos] = useState([]);
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

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
      console.error("Erro completo:", err);
      setError("Falha ao carregar dados: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const visualizarDocumento = async (documento) => {
    try {
      const filePath = documento.name;

      const { data: fileList, error: listError } = await supabase
        .storage
        .from('documentos')
        .list();

      if (listError) throw listError;

      if (!fileList.some(file => file.name === documento.name)) {
        throw new Error("Arquivo não encontrado no repositório");
      }

      const { data, error } = await supabase
        .storage
        .from('documentos')
        .createSignedUrl(filePath, 3600);

      if (error) throw error;

      router.push(`/consultar-doc?pdf=${encodeURIComponent(data.signedUrl)}&titulo=${encodeURIComponent(documento.name)}&autor=${encodeURIComponent(documento.author)}`);
    } catch (err) {
      console.error("Erro detalhado:", err);
      alert(`Erro ao abrir: ${err.message}`);
    }
  };

  // 🔍 Filtro de documentos
  const documentosFiltrados = documentos.filter((doc) => {
    const termo = termoPesquisa.toLowerCase();
    return (
      doc.name.toLowerCase().includes(termo) ||
      doc.author.toLowerCase().includes(termo)
    );
  });

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!user) return <div>Por favor, faça login para acessar os documentos</div>;

  return (
    <div>
      {documentosFiltrados.length === 0 ? (
        <p className="text-center text-gray-600">Nenhum documento encontrado</p>
      ) : (
        <div className="flex justify-center">
          <div className="space-y-4 w-full max-w-3xl">
            {documentosFiltrados.map((doc) => (
              <div 
                key={doc.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 mx-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 mr-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">{doc.name}</h2>
                    <p className="text-sm text-gray-600 mb-2">Autor: {doc.author}</p>
                    <p className="text-xs text-gray-500">
                      Criado em: {new Date(doc.created_at).toLocaleDateString('pt-PT')}
                    </p>
                  </div>

                  <button 
                    onClick={() => visualizarDocumento(doc)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md 
                              transition-colors flex-shrink-0 text-sm flex items-center gap-2"
                  >
                    <span>📄</span> Visualizar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pdfUrl && (
        <div className="mt-8 border-t pt-6">
          <PDFViewer url={pdfUrl} />
        </div>
      )}
    </div>
  );
}
