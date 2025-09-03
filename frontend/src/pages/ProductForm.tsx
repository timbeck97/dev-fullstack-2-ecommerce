import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { useNavigate, useParams } from "react-router-dom";
import { ProductType } from "../types/ProductType";
import { ProductSize } from "../types/ProductSize";
import { ProductScent } from "../types/ProductScent";







export interface Product {
  id?: number;
  name: string;
  description: string;
  scent: ProductScent;
  type: ProductType;
  size: ProductSize;
  price: string;
}

function ProductForm() {
  const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();
  const [product, setProduct] = useState<Product>({
    name: "",
    description: "",
    scent: ProductScent.BERGAMOTA_ALEGRIM,
    type: ProductType.VELA,
    size: ProductSize.UNICO,
    price: '',
  });

  useEffect(() => {
    if (id && id !== "novo") {
      const numericId = parseInt(id, 10);
      const fetchedProduct: Product = {
        id: numericId,
        name: "Produto Exemplo",
        description: "Descrição do produto",
        scent: ProductScent.MANGA_TANGERINA,
        type: ProductType.DIFUSOR,
        size: ProductSize.G200,
        price: '',
      };
      setProduct(fetchedProduct);
    }
  }, [id]);
  const handleSave = () => {
    console.log(product)
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Salvar produto:", product);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <button
        className="mb-4 text-gray-600 hover:text-gray-800 font-medium"
        onClick={() => navigate("/users")}
      >
        Voltar
      </button>
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {id === "novo" ? "Novo Produto" : "Editar Produto"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nome */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Nome</label>
          <input
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Descrição</label>
          <input
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Aroma */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Aroma</label>
          <select
            name="scent"
            value={product.scent}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {Object.values(ProductScent).map((s) => (
              <option key={s} value={s}>
                {s.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Tipo</label>
          <select
            name="type"
            value={product.type}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {Object.values(ProductType).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Tamanho */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Tamanho</label>
          <select
            name="size"
            value={product.size}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {Object.values(ProductSize).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Preço */}
        <CurrencyInput
          id="price"
          name="price"
          placeholder="R$ 0,00"
          value={product.price}
          decimalsLimit={2}
          decimalSeparator=","
          groupSeparator="."
          prefix="R$ "
          onValueChange={(value) => {
            setProduct((prev) => ({ ...prev, price: value || '' }));

          }}
          className="w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Botão */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          Salvar
        </button>
      </form>
    </div>
  );
}

export default ProductForm;
