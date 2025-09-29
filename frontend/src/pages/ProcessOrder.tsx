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
  birthDate: string,
  cpf: string;
  street: string;
  number: string;
  city: string,
  cep: string,
  state: string,
  role: string;
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
  const [bloqueado, setBloqueado] = useState<boolean>(false)
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
    fetchUserAddres();
  }, []);
  const fetchUserAddres = async () => {
    const resp = await axiosApi.get('usuarios/dados/me');
    console.log(resp)
    setClientData(resp.data)
    if(resp.data.role==='ADMIN'){
      setBloqueado(true)
      alert('Seu usuario nao tem permissao para efetutuar compras')
    }
  }
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


      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 text-center sm:text-left">
        <span className={`font-bold ${step === 1 ? "text-emerald-600" : ""}`}>1. Pedido</span>
        <span className={`font-bold ${step === 2 ? "text-emerald-600" : ""}`}>2. Entrega</span>
        <span className={`font-bold ${step === 3 ? "text-emerald-600" : ""}`}>3. Pagamento</span>
      </div>


      {step === 1 && (
        <div className="flex flex-col gap-4 bg-gray-50 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-emerald-700 border-b pb-2">🛒 Itens do Pedido</h2>

          {cartItems.map((item) => {
            const unitPrice = Number(item.price);
            const totalItem = unitPrice * item.quantity;

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row gap-4 flex-1">

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.type} | {item.size} | {item.scent}
                    </p>

                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        Valor unitário:{" "}
                        <span className="font-medium">R$ {unitPrice.toFixed(2)}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantidade:{" "}
                        <span className="font-medium">{item.quantity}</span>
                      </p>
                    </div>
                  </div>


                  <div className="flex items-center sm:items-start sm:justify-end text-right">
                    <span className="font-bold text-emerald-600 text-lg">
                      Total: R$ {totalItem.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}


          <div className="mt-6 text-right text-2xl font-bold text-emerald-700 border-t pt-4">
            Total do Pedido: R$ {total.toFixed(2)}
          </div>
        </div>
      )}



      {step === 2 && clientData && (
        <div className="flex flex-col gap-4 bg-gray-50 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-emerald-700 border-b pb-2">📍 Dados do Cliente</h2>

          <div className="grid grid-cols-2 gap-4">
            <p><span className="font-medium text-gray-700">Nome:</span> {clientData.name}</p>
            <p><span className="font-medium text-gray-700">CPF:</span> {clientData.cpf}</p>
            <p><span className="font-medium text-gray-700">Email:</span> {clientData.email}</p>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Endereço</h3>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p>{clientData.street}, {clientData.number}</p>
              <p>{clientData.city} - {clientData.state}</p>
              <p>CEP: {clientData.cep}</p>
            </div>
          </div>
        </div>
      )}



      {step === 3 && (
        <div className="flex flex-col gap-4 bg-gray-50 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-emerald-700 border-b pb-2">💳 Dados de Pagamento</h2>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Número do cartão"
              value={paymentData.cardNumber}
              onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 flex-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
            <input
              type="text"
              placeholder="Nome no cartão"
              value={paymentData.cardName}
              onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 flex-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>


          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="MM/AA"
              value={paymentData.expiry}
              onChange={(e) => setPaymentData({ ...paymentData, expiry: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 w-full sm:w-32 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
            <input
              type="text"
              placeholder="CVV"
              value={paymentData.cvv}
              onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 w-full sm:w-32 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>
        </div>
      )}



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
            disabled={bloqueado}
            className={`${bloqueado?'bg-gray-500':'bg-emerald-600  hover:bg-emerald-700 transition'} text-white py-2 px-4 rounded-xl sm:ml-auto`}
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
