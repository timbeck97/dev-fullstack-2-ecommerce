import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "./UserForm"; // ajuste o caminho conforme seu projeto

export const Users = () => {
  const navigate = useNavigate();

  // Lista de usuários exemplo
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "João",
      lastName: "Silva",
      cpf: "123.456.789-00",
      birthDate: "1990-05-20",
    },
    {
      id: 2,
      name: "Maria",
      lastName: "Souza",
      cpf: "987.654.321-00",
      birthDate: "1985-12-15",
    },
  ]);

  const handleDelete = (id?: number) => {
    if (!id) return;
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div className="mx-10 mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Usuários</h2>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          onClick={() => navigate("/users/manage/novo")}
        >
          Adicionar Novo
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Nome</th>
              <th className="py-2 px-4 border-b">Sobrenome</th>
              <th className="py-2 px-4 border-b">CPF</th>
              <th className="py-2 px-4 border-b">Data de Nascimento</th>
              <th className="py-2 px-4 border-b">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{u.id}</td>
                <td className="py-2 px-4 border-b">{u.name}</td>
                <td className="py-2 px-4 border-b">{u.lastName}</td>
                <td className="py-2 px-4 border-b">{u.cpf}</td>
                <td className="py-2 px-4 border-b">{u.birthDate}</td>
                <td className="py-2 px-4 border-b space-x-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                    onClick={() => navigate(`/users/manage/${u.id}`)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                    onClick={() => handleDelete(u.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
