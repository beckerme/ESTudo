"use client"

import { useState } from 'react';
import Image from 'next/image';

const MeuPerfil = () => {
  const [user, setUser] = useState({
    nome: 'Maria Santos',
    email: 'maria.santos@exemplo.com',
    curso: 'Ciência da Computação',
    fotoPerfil: '/default-avatar.png',
  });

  const [editando, setEditando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditando(false);
    console.log('Dados atualizados:', user);
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Cabeçalho */}
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
        </div>

        {/* Corpo */}
        <div className="p-6">
          {/* Foto e Nome */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-40 h-40 rounded-full border-4 border-blue-100 overflow-hidden mb-4">
              <Image
                src={user.fotoPerfil}
                alt="Foto de perfil"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            {editando && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alterar foto
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      setUser((prev) => ({ ...prev, fotoPerfil: imageUrl }));
                    }
                  }}
                />
              </div>
            )}
            <h2 className="text-xl font-semibold text-center">{user.nome}</h2>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Campo Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                {editando ? (
                  <input
                    type="text"
                    name="nome"
                    value={user.nome}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 rounded-md">{user.nome}</p>
                )}
              </div>

              {/* Campo Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                {editando ? (
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                ) : (
                  <p className="px-4 py-2 bg-gray-50 rounded-md">{user.email}</p>
                )}
              </div>

              {/* Campo Curso */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Curso
                </label>
                {editando ? (
                  <select
                    name="curso"
                    value={user.curso}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Ciência da Computação">Ciência da Computação</option>
                    <option value="Engenharia de Software">Engenharia de Software</option>
                    <option value="Sistemas de Informação">Sistemas de Informação</option>
                    <option value="Análise e Desenvolvimento de Sistemas">
                      Análise e Desenvolvimento de Sistemas
                    </option>
                    <option value="Outro">Outro</option>
                  </select>
                ) : (
                  <p className="px-4 py-2 bg-gray-50 rounded-md">{user.curso}</p>
                )}
              </div>
            </div>

            {/* Botões */}
            <div className="mt-8 flex justify-end space-x-3">
              {editando ? (
                <>
                  <button
                    type="button"
                    onClick={() => setEditando(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Salvar Alterações
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setEditando(true)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Editar Perfil
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MeuPerfil;
