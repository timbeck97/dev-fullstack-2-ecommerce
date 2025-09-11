import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Product } from "./ProductForm"; // ajuste o import
import { ProductScent } from "../types/ProductScent";
import { ProductType } from "../types/ProductType";
import { ProductSize } from "../types/ProductSize";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import axiosApi from "../service/axiosService";

export const Products = () => {
  const navigate = useNavigate();

const { user } = useContext(AuthContext);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -----------------------------
  // Buscar produtos do backend
  // -----------------------------
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/produtos");
      setProducts(response.data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const handleDelete = async (id?: number) => {
    if (!id) return;

    try {
      await axiosApi.delete(`http://localhost:5000/produtos/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
    }
  };

  if (loading) return <div className="p-10 text-center">Carregando produtos...</div>;

  return (
    <div className="mx-10 mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Produtos</h2>
     
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          onClick={() => navigate("/manage/product/novo")}
        >
          Adicionar Novo
        </button>
     
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Nome</th>
              <th className="py-2 px-4 border-b">Descrição</th>
              <th className="py-2 px-4 border-b">Aroma</th>
              <th className="py-2 px-4 border-b">Tipo</th>
              <th className="py-2 px-4 border-b">Tamanho</th>
              <th className="py-2 px-4 border-b">Preço</th>
              <th className="py-2 px-4 border-b">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{p.id}</td>
                <td className="py-2 px-4 border-b">{p.name}</td>
                <td className="py-2 px-4 border-b">{p.description}</td>
                <td className="py-2 px-4 border-b">{p.scent.replaceAll("_", " ")}</td>
                <td className="py-2 px-4 border-b">{p.type}</td>
                <td className="py-2 px-4 border-b">{p.size}</td>
                <td className="py-2 px-4 border-b">R$ {p.price}</td>
                <td className="py-2 px-4 border-b space-x-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                      onClick={() => navigate(`/manage/product/${p.id}`)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                      onClick={() => handleDelete(p.id)}
                    >
                      Excluir
                    </button>
                  </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
