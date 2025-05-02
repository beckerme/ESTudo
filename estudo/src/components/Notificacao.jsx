import { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react"; // Para ícones
import supabase from "@/app/config/supabaseClient"; // Ajuste o caminho conforme sua estrutura

export default function Notificacao({ isOpen, setIsOpen }) {
  const [notificacoes, setNotificacoes] = useState([]);
  const [loading, setLoading] = useState(false);

  const ESTADOS = {
    nao_lida : "7d18d158-79f4-4c2f-9083-e93605028ebc",
    lida : "9c381f61-d2f2-48af-ae2a-2a4799414a54",
    eliminada : "f834d0de-218d-4822-a805-b0c500456cf9",
  };

  // Carregar notificações quando o componente for aberto
  useEffect(() => {
    if (isOpen) {
      carregarNotificacoes();
    }
  }, [isOpen]);

  // Função assíncrona para carregar as notificações do utilizador logado
const carregarNotificacoes = async () => {
  // Define o estado de "loading" como true para indicar que os dados estão a ser carregados
  setLoading(true);

  // Tenta obter o utilizador atualmente autenticado no Supabase
  const {
    data: { user }, // Extrai o objeto "user" de dentro do "data"
    error: userError, // Se houver erro na autenticação, será armazenado aqui
  } = await supabase.auth.getUser(); // Faz a chamada à autenticação

  // Verifica se houve erro ou se o utilizador não foi encontrado
  if (userError || !user) {
    console.error("Erro ao obter utilizador:", userError?.message); // Mostra o erro na consola
    setLoading(false); // Para o estado de loading
    return; // Interrompe a execução da função
  }

  // Faz uma consulta à tabela "user_notifications" no Supabase
  const { data, error } = await supabase
    .from("user_notifications") // Define a tabela a consultar
    .select("*") // Seleciona todos os campos
    .eq("id_user", user.id) // Filtra apenas as notificações do utilizador autenticado
    .in("id_estado", [ESTADOS.nao_lida, ESTADOS.lida]) // Filtra apenas notificações com estado "não lida" ou "lida"
    .order("created_at", { ascending: false }) // Ordena os resultados do mais recente para o mais antigo
    .limit(30); // Limita o número de resultados a 10

  // Verifica se houve erro na consulta
  if (error) {
    console.error("Erro ao carregar notificações:", error.message); // Mostra o erro na consola
  } else {
    setNotificacoes(data); // Atualiza o estado com as notificações obtidas
  }

  // Termina o estado de loading
  setLoading(false);
};


  // Função para eliminar uma notificação
  const eliminarNotificacao = async (id) => {
    const { error } = await supabase
      .from("user_notifications")
      .update({ id_estado: ESTADOS.eliminada }) // Marcar como eliminada
      .eq("id_notification", id);

    if (error) {
      console.error("Erro ao eliminar notificação:", error.message);
    } else {
      // Atualizar as notificações no estado, removendo a notificação eliminada
      setNotificacoes((prev) => prev.filter((n) => n.id_notification !== id));
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <h2 className="text-lg font-semibold">Notificações</h2>
        <button onClick={() => setIsOpen(false)}>
          <X size={24} />
        </button>
      </div>

      <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(100%-4rem)]">
        {loading ? (
          <p className="text-gray-500">A carregar...</p>
        ) : notificacoes.length > 0 ? (
          notificacoes.map((notif) => (
            <div
              key={notif.id_notification}
              className="bg-gray-100 rounded-lg p-3 shadow-sm hover:bg-gray-200 transition flex justify-between items-start"
            >
              <span>{notif.mensagem}</span>
              <button onClick={() => eliminarNotificacao(notif.id_notification)} className="text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Sem notificações.</p>
        )}
      </div>
    </div>
  );
}
