import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosApi from "../service/axiosService";
import axios from "axios";
import { UserFormData } from "../types/UserFormData";

interface ClientFormProps {
  manage: boolean;
  formType: 'INSERIR' | 'UPDATE_USER' | 'UPDATE_ADMIN'
}



export const ClientForm = ({ manage, formType }: ClientFormProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserFormData>({
    name: "",
    cpf: "",
    email: "",
    password: "",
    confirmPassword: "",
    number: "",
    street: "",
    neighborhood: "",
    city: "",
    state: "",
    cep: "",
  });


  const fetchUser = async (userId: string) => {
    try {
      const resp = await axiosApi.get(`/usuarios/completo/${userId}`);
      const data = resp.data;
      setUser({
        name: data.name || "",
        cpf: data.cpf || "",
        email: data.email || "",
        password: "",
        confirmPassword: "",
        number: data.number || "",
        street: data.street || "",
        neighborhood: data.neighborhood || "",
        city: data.city || "",
        state: data.state || "",
        cep: data.cep || "",
      });
    } catch (err) {
      console.error("Erro ao carregar usuário:", err);
    }
  };
  const fetchMe = async () => {
    try {
      const resp = await axiosApi.get(`/usuarios/editar/meusDados`);
      const data = resp.data;
      setUser({
        name: data.name || "",
        cpf: data.cpf || "",
        email: data.email || "",
        password: "",
        confirmPassword: "",
        number: data.number || "",
        street: data.street || "",
        neighborhood: data.neighborhood || "",
        city: data.city || "",
        state: data.state || "",
        cep: data.cep || "",
      });
    } catch (err) {
      console.error("Erro ao carregar usuário:", err);
    }
  };

  useEffect(() => {
    if (formType !== 'INSERIR' && id !== 'novo') {
      if (id && id !== "novo") {
        fetchUser(id);
      } else {
        fetchMe();
      }
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!manage && user.password !== user.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    try {

      if (formType === "UPDATE_ADMIN") {
        if (id && id === 'novo') {
          await axiosApi.post(`/usuarios`, {
            ...user,
            password: user.password || undefined,
          });
          navigate('/users')
        } else {
          await axiosApi.put(`/usuarios/${id}`, {
            ...user,
            password: user.password || undefined,
          });
          alert('Dados Alterados')
        }
      } else if (formType === 'INSERIR') {
        await axios.post(`http://localhost:5000/usuarios/me/novo`, user);
        alert("Usuário cadastrado com sucesso!");
      } else if (formType === 'UPDATE_USER') {
        await axiosApi.put(`/usuarios/editar/meuUsuario`, user);
        alert('Dados Alterados')
      }

      if (formType !== 'INSERIR' && id !== 'novo') {
        if (id && id !== "novo") {
          fetchUser(id);
        } else {
          fetchMe();
        }
      }
    } catch (err) {
      console.error("Erro ao salvar usuário:", err);

    }
  };

  return (
    <div className="bg-gray-100 flex justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-3xl mt-20">
        <h1 className="text-3xl font-bold text-center mb-6">
          {id && id !== "novo" ? "Editar Usuário" : "Cadastro"}
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1 font-medium text-gray-700">
              Nome
            </label>
            <input
              id="name"
              type="text"
              required
              value={user.name}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>


          <div className="flex flex-col">
            <label htmlFor="cpf" className="mb-1 font-medium text-gray-700">
              CPF
            </label>
            <input
              id="cpf"
              type="text"
              required
              value={user.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>


          <div className="flex flex-col">
            <label htmlFor="street" className="mb-1 font-medium text-gray-700">
              Rua
            </label>
            <input
              id="street"
              type="text"
              required
              value={user.street}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="number" className="mb-1 font-medium text-gray-700">
              Número
            </label>
            <input
              id="number"
              type="text"
              required
              value={user.number}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="neighborhood"
              className="mb-1 font-medium text-gray-700"
            >
              Bairro
            </label>
            <input
              id="neighborhood"
              type="text"
              required
              value={user.neighborhood}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="city" className="mb-1 font-medium text-gray-700">
              Cidade
            </label>
            <input
              id="city"
              type="text"
              required
              value={user.city}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="state" className="mb-1 font-medium text-gray-700">
              Estado
            </label>
            <input
              id="state"
              type="text"
              required
              value={user.state}
              onChange={handleChange}
              placeholder="Ex: SP"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="cep" className="mb-1 font-medium text-gray-700">
              CEP
            </label>
            <input
              id="cep"
              type="text"
              required
              value={user.cep}
              onChange={handleChange}
              placeholder="00000-000"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>


          <div className="flex flex-col col-span-2">
            <label htmlFor="email" className="mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={user.email}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>




          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="mb-1 font-medium text-gray-700"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={user.password}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="confirmPassword"
              className="mb-1 font-medium text-gray-700"
            >
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={user.confirmPassword}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>



          <div className="col-span-2 mt-4">
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition"
            >
              {(id && id !== "novo" || formType === 'UPDATE_USER') ? "Salvar Alterações" : "Cadastrar"}
            </button>
          </div>
        </form>

        {!manage && (id && id === "novo" || formType === 'INSERIR') && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Já tem uma conta?{" "}
            <a href="/login" className="text-emerald-600 hover:underline">
              Entrar
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
