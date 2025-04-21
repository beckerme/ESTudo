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

  // Função para carregar as notificações da base de dados
  const carregarNotificacoes = async () => {
    setLoading(true);

    // Pegar o usuário logado
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // Se não houver um utilizador autenticado, não carregar notificações
    if (userError || !user) {
      console.error("Erro ao obter utilizador:", userError?.message);
      setLoading(false);
      return;
    }

    // Buscar as notificações do utilizador
    const { data, error } = await supabase
      .from("user_notifications")
      .select("*")
      .eq("id_user", user.id) // Garantir que estamos a buscar as notificações do utilizador logado
      .in("id_estado", [ESTADOS.nao_lida, ESTADOS.lida]) // Vai buscar apenas notificações lidas ou não lidas
      .order("id", { ascending: false }); // Ordenar por ID (mais recentes primeiro)

    setLoading(false);
  };

  // Função para eliminar uma notificação
  const eliminarNotificacao = async (id) => {
    const { error } = await supabase
      .from("user_notifications")
      .update({ id_estado: ESTADOS.eliminada }) // Marcar como eliminada
      .eq("id", id);

    if (error) {
      console.error("Erro ao eliminar notificação:", error.message);
    } else {
      // Atualizar as notificações no estado, removendo a notificação eliminada
      setNotificacoes((prev) => prev.filter((n) => n.id !== id));
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
              key={notif.id}
              className="bg-gray-100 rounded-lg p-3 shadow-sm hover:bg-gray-200 transition flex justify-between items-start"
            >
              <span>{notif.mensagem}</span>
              <button onClick={() => eliminarNotificacao(notif.id)} className="text-red-500">
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
