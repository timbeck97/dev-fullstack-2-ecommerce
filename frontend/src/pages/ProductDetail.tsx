import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductScent } from "../types/ProductScent";
import { ProductType } from "../types/ProductType";
import { ProductSize } from "../types/ProductSize";

export interface Product {
  id: number;
  name: string;
  description: string;
  scent: ProductScent;
  type: ProductType;
  size: ProductSize;
  price: string;
}

interface CartItem extends Product {
  quantity: number;
}

const mockProducts: Product[] = [
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
];

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const found = mockProducts.find((p) => p.id === Number(id));
      setProduct(found || null);
    }
  }, [id]);

  const addToCart = () => {
    if (!product) return;

    const storedCart = localStorage.getItem("shoppingCart");
    const cart: CartItem[] = storedCart ? JSON.parse(storedCart) : [];

    const existingIndex = cart.findIndex((item) => item.id === product.id);
    if (existingIndex >= 0) {
      // Se já existir, soma a quantidade
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("shoppingCart", JSON.stringify(cart));
    navigate("/shoppingcart");
  };

  if (!product) {
    return (
      <div className="text-center text-xl mt-10 text-red-500">
        Produto não encontrado
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md">
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
        onClick={addToCart}
      >
        Adicionar ao Carrinho
      </button>
    </div>
  );
};
