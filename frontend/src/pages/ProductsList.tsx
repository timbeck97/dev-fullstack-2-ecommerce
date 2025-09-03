import React from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "./ProductForm";
import { ProductScent } from "../types/ProductScent";
import { ProductType } from "../types/ProductType";
import { ProductSize } from "../types/ProductSize";

export const ProductsList = () => {
  const navigate = useNavigate();

  const products: Product[] = [
    {
      id: 1,
      name: "Vela Aromática",
      description: "Vela artesanal com aroma refrescante.",
      scent: ProductScent.BERGAMOTA_ALEGRIM,
      type: ProductType.VELA,
      size: ProductSize.G200,
      price: "39,90",
    },
    {
      id: 2,
      name: "Difusor de Ambientes",
      description: "Perfuma o ambiente por até 60 dias.",
      scent: ProductScent.MANGA_TANGERINA,
      type: ProductType.DIFUSOR,
      size: ProductSize.ML250,
      price: "59,90",
    },
    {
      id: 3,
      name: "Home Spray",
      description: "Ideal para perfumar pequenos ambientes.",
      scent: ProductScent.CHA_BRANCO,
      type: ProductType.HOME_SPRAY,
      size: ProductSize.ML45,
      price: "29,90",
    },
    {
      id: 4,
      name: "Essência Concentrada",
      description: "Para difusores elétricos ou aromatizadores.",
      scent: ProductScent.AMENDOAS_CANELA,
      type: ProductType.ESSENCIA,
      size: ProductSize.ML500,
      price: "49,90",
    },
  ];

  return (
    <div className="flex justify-center">
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
                  e.stopPropagation(); // impede clique duplo (card + botão)
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
