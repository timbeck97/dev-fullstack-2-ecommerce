import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export const ShoppingCart = () => {
  const { cartItems, removeFromCart, addToCart } = useCart();
  const navigate = useNavigate();

  const updateQuantity = (id: number, quantity: number) => {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;

    const diff = quantity - item.quantity;
    if (diff !== 0) {
      addToCart(item, diff);
    }
  };

  const total = cartItems.reduce(
    (acc, item) => acc + Number(item.price.replace(",", ".")) * item.quantity,
    0
  );

  const handleCheckout = () => {
    navigate("/processOrder");
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center mt-10 text-xl">
        Seu carrinho está vazio
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">Carrinho de Compras</h1>

      <div className="flex flex-col gap-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b pb-3"
          >
            <div>
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-sm text-gray-500">
                {item.type} | {item.size} | {item.scent}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.id, Number(e.target.value))
                }
                className="w-16 border rounded-lg p-1 text-center"
              />
              <span className="font-bold text-emerald-600">
                R$ {(Number(item.price.replace(",", ".")) * item.quantity).toFixed(2)}
              </span>
              <button
                className="text-red-600 hover:underline"
                onClick={() => removeFromCart(item.id)}
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center mb-4">
        <span className="text-xl font-bold">Total:</span>
        <span className="text-xl font-bold text-emerald-600">
          R$ {total.toFixed(2)}
        </span>
      </div>

      <button
        onClick={handleCheckout}
        className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition"
      >
        Finalizar Compra
      </button>
    </div>
  );
};
