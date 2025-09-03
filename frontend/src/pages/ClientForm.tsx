import { useState } from "react";

export const ClientForm = () => {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    alert(
      `Nome: ${name}\nCPF: ${cpf}\nEmail: ${email}\nSenha: ${password}\nEndereço: ${address}\nRua: ${street}\nBairro: ${neighborhood}`
    );
  };

  return (
    <div className="bg-gray-100 flex justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-3xl mt-20">
        <h1 className="text-3xl font-bold text-center mb-6">Cadastro</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1 font-medium text-gray-700">
              Nome
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="000.000.000-00"
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="address" className="mb-1 font-medium text-gray-700">
              Endereço
            </label>
            <input
              id="address"
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="neighborhood" className="mb-1 font-medium text-gray-700">
              Bairro
            </label>
            <input
              id="neighborhood"
              type="text"
              required
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1 font-medium text-gray-700">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="mb-1 font-medium text-gray-700">
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="col-span-2 mt-4">
            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition"
            >
              Cadastrar
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          Já tem uma conta?{" "}
          <a href="/login" className="text-emerald-600 hover:underline">
            Entrar
          </a>
        </div>
      </div>
    </div>
  );
};
