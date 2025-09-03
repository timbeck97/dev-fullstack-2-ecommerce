import { useState } from "react";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Email: ${email}\nSenha: ${password}`);
  };

  return (
    <div className="bg-gray-100 flex justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md mt-20">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
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

          <button
            type="submit"
            className="mt-4 bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition"
          >
            Entrar
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          Não tem uma conta?{" "}
          <a href="/register" className="text-emerald-600 hover:underline">
            Cadastre-se
          </a>
        </div>
      </div>
    </div>
  );
};
