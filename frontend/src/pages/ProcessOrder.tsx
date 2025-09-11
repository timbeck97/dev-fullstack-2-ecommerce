import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

interface CartItem {
  id: number;
  name: string;
  type: string;
  size: string;
  scent: string;
  price: string;
  quantity: number;
}

interface ClientData {
  name: string;
  cpf: string;
  address: string;
  street: string;
  neighborhood: string;
  email: string;
}

export const ProcessOrder = () => {
  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const {clearCart} = useCart()
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = localStorage.getItem("shoppingCart");
    const storedClient = localStorage.getItem("clientData");

    if (storedCart) setCartItems(JSON.parse(storedCart));
    if (storedClient) setClientData(JSON.parse(storedClient));
  }, []);

  const total = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * item.quantity,
    0
  );

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleConfirmOrder = () => {
    alert("Pedido finalizado! Obrigado pela compra.");
    clearCart()
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">Finalizar Pedido</h1>

      <div className="mb-6 flex justify-between">
        <span className={`font-bold ${step === 1 ? "text-emerald-600" : ""}`}>1. Pedido</span>
        <span className={`font-bold ${step === 2 ? "text-emerald-600" : ""}`}>2. Entrega</span>
        <span className={`font-bold ${step === 3 ? "text-emerald-600" : ""}`}>3. Pagamento</span>
      </div>

      {step === 1 && (
        <div className="flex flex-col gap-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between border-b pb-2">
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-500">{item.type} | {item.size} | {item.scent}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-600">
                  R$ {(Number(item.price) * item.quantity).toFixed(2)}
                </span>
                <p className="text-sm text-gray-500">Qtd: {item.quantity}</p>
              </div>
            </div>
          ))}
          <div className="mt-4 text-right text-xl font-bold text-emerald-600">
            Total: R$ {total.toFixed(2)}
          </div>
        </div>
      )}

      {step === 2 && clientData && (
        <div className="flex flex-col gap-3">
          <p><span className="font-medium">Nome:</span> {clientData.name}</p>
          <p><span className="font-medium">CPF:</span> {clientData.cpf}</p>
          <p><span className="font-medium">Endereço:</span> {clientData.address}, {clientData.street}, {clientData.neighborhood}</p>
          <p><span className="font-medium">Email:</span> {clientData.email}</p>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-4">
          <p className="font-medium mb-2">Dados de Pagamento</p>
          <input
            type="text"
            placeholder="Número do cartão"
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="text"
            placeholder="Nome no cartão"
            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="MM/AA"
              className="border border-gray-300 rounded-lg p-2 w-24 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              placeholder="CVV"
              className="border border-gray-300 rounded-lg p-2 w-24 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-between">
        {step > 1 && (
          <button
            onClick={prevStep}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-400 transition"
          >
            Voltar
          </button>
        )}

        {step < 3 && (
          <button
            onClick={nextStep}
            className="bg-emerald-600 text-white py-2 px-4 rounded-xl hover:bg-emerald-700 transition ml-auto"
          >
            Próximo
          </button>
        )}

        {step === 3 && (
          <button
            onClick={handleConfirmOrder}
            className="bg-emerald-600 text-white py-2 px-4 rounded-xl hover:bg-emerald-700 transition ml-auto"
          >
            Finalizar Pedido
          </button>
        )}
      </div>
    </div>
  );
};
