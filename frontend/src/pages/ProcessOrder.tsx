import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axiosApi from "../service/axiosService";

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

interface PaymentData {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

export const ProcessOrder = () => {
  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData>({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  const { clearCart } = useCart();
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

  const handleConfirmOrder = async () => {
    try {
      await axiosApi.post("/order", {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        paymentData,
      });
      clearCart();
      navigate("/");

    } catch (err) {
      console.error(err);
      alert("Erro ao finalizar pedido.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 sm:p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">Finalizar Pedido</h1>

      {/* Passos */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 text-center sm:text-left">
        <span className={`font-bold ${step === 1 ? "text-emerald-600" : ""}`}>1. Pedido</span>
        <span className={`font-bold ${step === 2 ? "text-emerald-600" : ""}`}>2. Entrega</span>
        <span className={`font-bold ${step === 3 ? "text-emerald-600" : ""}`}>3. Pagamento</span>
      </div>

      {/* Etapa 1 - Pedido */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          {cartItems.map((item) => {
            const unitPrice = Number(item.price);
            const totalItem = unitPrice * item.quantity;

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row justify-between border-b pb-2 gap-2"
              >
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 flex-1">
                  <div className="flex-1">
                    <h2 className="font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-500 truncate">
                      {item.type} | {item.size} | {item.scent}
                    </p>
                    <p className="text-sm text-gray-600">
                      Valor unitário: <span className="font-medium">R$ {unitPrice.toFixed(2)}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Quantidade: <span className="font-medium">{item.quantity}</span>
                    </p>
                  </div>
                  <div className="text-right sm:text-right">
                    <span className="font-bold text-emerald-600">
                      Total: R$ {totalItem.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="mt-4 text-right text-xl font-bold text-emerald-600">
            Total do Pedido: R$ {total.toFixed(2)}
          </div>
        </div>
      )}

      {/* Etapa 2 - Cliente */}
      {step === 2 && clientData && (
        <div className="flex flex-col gap-3">
          <p><span className="font-medium">Nome:</span> {clientData.name}</p>
          <p><span className="font-medium">CPF:</span> {clientData.cpf}</p>
          <p><span className="font-medium">Endereço:</span> {clientData.address}, {clientData.street}, {clientData.neighborhood}</p>
          <p><span className="font-medium">Email:</span> {clientData.email}</p>
        </div>
      )}

      {/* Etapa 3 - Pagamento */}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          <p className="font-medium mb-2">Dados de Pagamento</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Número do cartão"
              value={paymentData.cardNumber}
              onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
              className="border border-gray-300 rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              placeholder="Nome no cartão"
              value={paymentData.cardName}
              onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
              className="border border-gray-300 rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="MM/AA"
              value={paymentData.expiry}
              onChange={(e) => setPaymentData({ ...paymentData, expiry: e.target.value })}
              className="border border-gray-300 rounded-lg p-2 w-full sm:w-24 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              placeholder="CVV"
              value={paymentData.cvv}
              onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
              className="border border-gray-300 rounded-lg p-2 w-full sm:w-24 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      )}

      {/* Botões de navegação */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between gap-2">
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
            className="bg-emerald-600 text-white py-2 px-4 rounded-xl hover:bg-emerald-700 transition sm:ml-auto"
          >
            Próximo
          </button>
        )}
        {step === 3 && (
          <button
            onClick={handleConfirmOrder}
            className="bg-emerald-600 text-white py-2 px-4 rounded-xl hover:bg-emerald-700 transition sm:ml-auto"
          >
            Finalizar Pedido
          </button>
        )}
      </div>
    </div>

  );
};
