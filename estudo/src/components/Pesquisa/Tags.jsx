"use client";

// 🏷️ Componente Tags: Exibe botões clicáveis para filtrar documentos por tags.
// Recebe a lista de tags, uma função para lidar com a mudança de tag selecionada,
// e o ID da tag que está atualmente ativa.
export default function Tags({ tags, onTagChange, activeTagId, allCategoriesLabel = "Todas as Categorias" }) {

    // 🖱️ Função que lida com o clique em um botão de tag
    const handleTagClick = (tagId) => {

        // 🔄 Lógica de alternância: Se a tag clicada JÁ for a tag ativa, desativa o filtro (define newTagId como vazio).
        // Caso contrário, define a tag clicada como a nova tag ativa.
        const newTagId = tagId === activeTagId ? '' : tagId;

        // ⬆️ Chama a função `onTagChange` recebida via props, passando o novo ID da tag (ou string vazia para desativar)
        onTagChange(newTagId);
    };

  return (
    // 📦 Container principal para o componente
    <div className="flex flex-col items-center mt-4">
      {/* 🏷️ Container flexível para os botões das tags, centralizados e com espaçamento */}
      <div className="flex flex-wrap justify-center gap-2 px-4">

        {/* 🌐 Botão/Opção especial para "Todas as Categorias" (limpa o filtro) */}
        <button
          className={`
            px-3 py-1 text-sm rounded-full border {/* Estilos base do botão */}
            ${activeTagId === ''
              // Estilos quando "Todas as Categorias" está ativo (activeTagId é string vazia) ✅
              ? 'bg-[#012B55] text-white border-[#012B55]'
              // Estilos quando "Todas as Categorias" NÃO está ativo ⚪
              : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
            }
            cursor-pointer transition duration-200 ease-in-out {/* Estilos de cursor e transição */}
          `}
          onClick={() => handleTagClick('')}                                      // 🖱️ Chama handleTagClick com string vazia para limpar o filtro
        >
          {allCategoriesLabel}
        </button>

        {/* 🗺️ Mapeia o array de 'tags' recebido via props para criar um botão para cada tag */}
        {tags.map((tag) => (
          // 🔘 Botão individual para cada tag
          <button
            key={tag.id}                                                          // 🔑 Chave única para otimização do React ao renderizar listas
            className={`
              px-3 py-1 text-sm rounded-full border {/* Estilos base do botão */}
              ${tag.id === activeTagId
                // Estilos quando esta tag específica está ativa (o ID da tag coincide com activeTagId) ✅
                ? 'bg-[#012B55] text-white border-[#012B55]'
                // Estilos quando esta tag específica NÃO está ativa ⚪
                : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
              }
              cursor-pointer transition duration-200 ease-in-out {/* Estilos de cursor e transição */}
            `}
            onClick={() => handleTagClick(tag.id)}                                // 🖱️ Chama handleTagClick com o ID desta tag específica
          >
            {tag.designacao} {/* Exibe o nome (designação) da tag */}
          </button>
        ))}
      </div>
    </div>
  );
}