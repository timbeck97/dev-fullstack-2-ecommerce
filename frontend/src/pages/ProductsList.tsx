import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "./ProductForm";
import axios from "axios";

export const ProductsList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/produtos");
      setProducts(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center mt-5 px-4">
      <div
        className="grid gap-6 w-full max-w-6xl 
                   grid-cols-1 
                   sm:grid-cols-2 
                   md:grid-cols-3"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col cursor-pointer"
            onClick={() => navigate(`/product/${product.id}`)}
          >

            {product.imageUrl && (
              <div className="w-full h-70 relative mb-4">
                <img
                  src={`http://localhost:5000${product.imageUrl}`}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            )}

            <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{product.description}</p>

            <div className="text-sm text-gray-500 mb-3 space-y-1">
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

            <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-lg font-bold text-emerald-600">
                R${" "}
                {new Intl.NumberFormat("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(Number(product.price))}
              </span>
              <button
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/product/${product.id}`);
                }}
              >
                Abrir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
