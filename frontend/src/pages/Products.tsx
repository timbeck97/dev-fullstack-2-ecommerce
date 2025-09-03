import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product} from "./ProductForm"; // ajuste o import
import { ProductScent } from "../types/ProductScent";
import { ProductType } from "../types/ProductType";
import { ProductSize } from "../types/ProductSize";

export const Products = () => {
  const navigate = useNavigate();


  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Vela Lavanda",
      description: "Vela aromática",
      scent: ProductScent.CHA_BRANCO,
      type: ProductType.VELA,
      size: ProductSize.G100,
      price: '49.9',
    },
    {
      id: 2,
      name: "Difusor Manga",
      description: "Difusor perfumado",
      scent: ProductScent.MANGA_TANGERINA,
      type: ProductType.DIFUSOR,
      size: ProductSize.ML250,
      price: '89.9',
    },
  ]);

  const handleDelete = (id?: number) => {
    if (!id) return;
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className=" mx-10 mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Produtos</h2>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          onClick={() => navigate("/product/manage/novo")}
        >
          Adicionar Novo
        </button>
      </div>

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
                    onClick={() => navigate(`/product/manage/${p.id}`)}
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
