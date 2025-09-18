import { useEffect, useState } from "react";
import Order from "../types/Order";
import { ProductType } from "../types/ProductType";
import { ProductSize } from "../types/ProductSize";
import { ProductScent } from "../types/ProductScent";
import CartItem from "../types/CardItem";
import axiosApi from "../service/axiosService";


export const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    const resp = await axiosApi.get('order');
    console.log(resp)
    setOrders(resp.data)
  }
  useEffect(() => {
    fetchOrders();
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
                {order.orderData}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between border-b pb-1 text-gray-700"
                >
                  <span>
                    {item.productName} ({item.type} | {item.size} | {item.scent}) x {item.quantity || 1}
                  </span>
                  <span>R$ {new Intl.NumberFormat("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(item.value)}</span>
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
