import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext"; // hook do CartContext

import axios from "axios";
import ProductCard from "../types/ProductCard";

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductCard | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const navigate = useNavigate();
  const { addToCart } = useCart(); // pega a função do contexto

  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id]);

  const fetchProduct = async (id: string) => {
    try {
      const response = await axios.get("http://localhost:5000/produtos/" + id);
      setProduct(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate("/shoppingcart");
  };

  if (!product) {
    return (
      <div className="text-center text-xl mt-10 text-red-500">
        Carregando produto...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md">

      {product.imageUrl && (
        <div className="w-full mb-6 overflow-hidden rounded-2xl shadow-lg flex justify-center bg-gray-100">
          <img
            src={`http://localhost:5000${product.imageUrl}`}
            alt={product.name}
            className="w-full max-h-[500px] object-contain"
          />
        </div>
      )}

      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-600 mb-4">{product.description}</p>

      <div className="text-sm text-gray-500 mb-4">
        <p>
          <span className="font-medium">Tipo:</span> {product.type}
        </p>
        <p>
          <span className="font-medium">Tamanho:</span> {product.size}
        </p>
        <p>
          <span className="font-medium">Aroma:</span> {product.scent}
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <span className="text-2xl font-bold text-emerald-600">
          R$ {product.price}
        </span>

        <div className="flex items-center gap-2">
          <label htmlFor="qty" className="text-sm font-medium">
            Quantidade:
          </label>
          <input
            id="qty"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 border rounded-lg p-2 text-center"
          />
        </div>
      </div>

      <button
        className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition"
        onClick={handleAddToCart}
      >
        Adicionar ao Carrinho
      </button>
    </div>
  );
};
