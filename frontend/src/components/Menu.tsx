import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; // hook do CartContext

export const Menu = () => {
  const { totalQuantity } = useCart(); // pega a quantidade total do carrinho

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex-shrink-0 text-2xl font-bold text-gray-800">
            <Link to="/" title="Página inicial" className="text-gray-700 hover:text-gray-900">
              Loja de Aromas
            </Link>
          </div>

          <nav className="flex items-center space-x-6">
            <Link to="/manage/product" title="Gerenciar produtos" className="text-gray-700 hover:text-gray-900">
              Produtos
            </Link>
            <Link to="/users" title="Gerenciar usuários" className="text-gray-700 hover:text-gray-900">
              Usuários
            </Link>
            <Link to="/login" title="Login" className="text-gray-700 hover:text-gray-900">
              Login
            </Link>
            <Link to="/orders" title="Meus pedidos" className="text-gray-700 hover:text-gray-900">
              Meus Pedidos
            </Link>

            {/* Carrinho */}
            <Link to="/shoppingcart" title="Carrinho de compras" className="relative text-gray-700 hover:text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.6 8h13.2L17 13M7 13H5.4M17 13l1.6 8M9 21h6"
                />
              </svg>

              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalQuantity}
                </span>
              )}
            </Link>
          </nav>

        </div>
      </div>
    </header>
  );
};
