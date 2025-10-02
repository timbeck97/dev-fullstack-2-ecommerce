import { useEffect, useState } from "react";
import Order from "../types/Order";
import axiosApi from "../service/axiosService";

export const ManageOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const fetchOrders = async () => {
    try {
      const resp = await axiosApi.get("order");
      setOrders(resp.data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (orders.length === 0) {
    return (
      <div className="text-center mt-10 text-xl">
        Nenhum pedido encontrado
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-6">Todos os Pedidos</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b text-left"># Pedido</th>
              <th className="px-4 py-2 border-b text-left">Cliente</th>
              <th className="px-4 py-2 border-b text-left">Data</th>
              <th className="px-4 py-2 border-b text-left">Total</th>
              <th className="px-4 py-2 border-b text-left">Ação</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b font-medium">#{order.id}</td>
                  <td className="px-4 py-2 border-b">{order.client}</td>
                  <td className="px-4 py-2 border-b">{order.orderData}</td>
                  <td className="px-4 py-2 border-b font-bold text-emerald-600">
                    R$ {order.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="text-blue-600 hover:underline"
                    >
                      {expandedOrderId === order.id ? "Ocultar" : "Detalhar"}
                    </button>
                  </td>
                </tr>

                {/* Linha expandida com detalhes */}
                {expandedOrderId === order.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={5} className="px-4 py-2 border-b">
                      <div className="flex flex-col gap-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between px-2 py-1 bg-white rounded-md shadow-sm"
                          >
                            <span className="text-gray-700">
                              {item.productName} ({item.type} | {item.size} | {item.scent}) x {item.quantity || 1}
                            </span>
                            <span className="font-medium text-gray-900">
                              R$ {item.value.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </>

            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
