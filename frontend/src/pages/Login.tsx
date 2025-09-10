import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [userLogin, setUserLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { totalQuantity } = useCart();
   const { login } = useContext(AuthContext);

    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        username: userLogin, 
        password,
      });

      login(response.data.token); // salva token no AuthContext
      if(totalQuantity>0){
        navigate('/shoppingcart')
      }else{
        navigate('/')
      }
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || "Erro ao fazer login");
      } else {
        setError("Erro de conexão com o servidor");
      }
    }
  };

  return (
    <div className="bg-gray-100 flex justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md mt-20">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

        <form  className="flex flex-col gap-4">
           {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1 font-medium text-gray-700">
              Email ou CPF
            </label>
            <input
              id="email"
              type="email"
              required
              value={userLogin}
              onChange={(e) => setUserLogin(e.target.value)}
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
            onClick={handleLogin}
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
