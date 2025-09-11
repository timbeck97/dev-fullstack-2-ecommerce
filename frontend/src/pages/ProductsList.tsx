import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "./ProductForm";
import { ProductScent } from "../types/ProductScent";
import { ProductType } from "../types/ProductType";
import { ProductSize } from "../types/ProductSize";
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
    <div className="flex justify-center mt-5">
      <div className="grid grid-cols-3 gap-6 max-w-6xl">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col cursor-pointer"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{product.description}</p>

            <div className="text-sm text-gray-500 mb-3">
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

            <div className="mt-auto flex items-center justify-between">
              <span className="text-lg font-bold text-emerald-600">
                R$ {product.price}
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
