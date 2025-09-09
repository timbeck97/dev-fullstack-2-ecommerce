import { useEffect, useState } from "react";
import Order from "../types/Order";
import { ProductType } from "../types/ProductType";
import { ProductSize } from "../types/ProductSize";
import { ProductScent } from "../types/ProductScent";
import CartItem from "../types/CardItem";


export const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      // Mock de pedidos usando enums
      const mockOrders: Order[] = [
        {
          id: 1,
          user: "João",
          date: new Date("2025-08-03T14:00:00"),
          total: 149.7,
          itens: [
            {
              id: 1,
              name: "Vela Aromática",
              description: "Vela artesanal",
              price: "39,90",
              type: ProductType.VELA,
              size: ProductSize.G200,
              scent: ProductScent.BERGAMOTA_ALEGRIM,
              quantity:5
            },
            {
              id: 2,
              name: "Difusor de Ambientes",
              description: "Perfuma o ambiente",
              price: "59,90",
              type: ProductType.DIFUSOR,
              size: ProductSize.ML250,
              scent: ProductScent.MANGA_TANGERINA,
              quantity:5
            },
          ],
        },
         {
          id: 2,
          user: "Pedro",
          date: new Date("2025-08-23T14:00:00"),
          total: 149.7,
          itens: [
            {
              id: 1,
              name: "Vela Aromática",
              description: "Vela artesanal",
              price: "39,90",
              type: ProductType.VELA,
              size: ProductSize.G200,
              scent: ProductScent.BERGAMOTA_ALEGRIM,
              quantity:5
            },
            {
              id: 2,
              name: "Difusor de Ambientes",
              description: "Perfuma o ambiente",
              price: "59,90",
              type: ProductType.DIFUSOR,
              size: ProductSize.ML250,
              scent: ProductScent.MANGA_TANGERINA,
              quantity:5
            },
          ],
        },
      ];
      setOrders(mockOrders);
    }
  }, []);

  if (orders.length === 0) {
    return (
      <div className="text-center mt-10 text-xl">
        Nenhum pedido encontrado
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">Meus Pedidos</h1>
      <div className="flex flex-col gap-6">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-xl p-4 shadow-sm">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Pedido #{order.id}</span>
              <span className="text-gray-500 text-sm">
                {new Date(order.date).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {order.itens.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between border-b pb-1 text-gray-700"
                >
                  <span>
                    {item.name} ({item.type} | {item.size} | {item.scent}) x {item.quantity || 1}
                  </span>
                  <span>R$ {item.price}</span>
                </div>
              ))}
            </div>

            <div className="mt-2 flex justify-end font-bold text-emerald-600">
              Total: R$ {order.total.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
