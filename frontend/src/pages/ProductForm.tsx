import { useNavigate, useParams } from "react-router-dom";
import { ProductType } from "../types/ProductType";
import { ProductSize } from "../types/ProductSize";
import { ProductScent } from "../types/ProductScent";
import axiosApi from "../service/axiosService";
import axios from "axios";
import { useEffect, useState } from "react";
import CurrencyInput from "react-currency-input-field";








export interface Product {
  id?: number;
  name: string;
  description: string;
  scent: ProductScent;
  type: ProductType;
  size: ProductSize;
  price: string;
}

export const ProductForm = () => {
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
    if (id && id === "novo") {
      const fetchedProduct: Product = {
        name: "",
        description: "",
        scent: ProductScent.MANGA_TANGERINA,
        type: ProductType.DIFUSOR,
        size: ProductSize.G200,
        price: '',
      };
      setProduct(fetchedProduct);
    } else {
      if (id) {
        fetchProduct(id)
      }
    }
  }, [id]);
  const fetchProduct = async (id: string) => {
    try {
      const response = await axios.get<Product>("http://localhost:5000/produtos/" + id);
      console.log('response product', response.data)
      setProduct({...response.data, price:String(response.data.price)});
    } catch (err) {
      console.error(err);
    }
  };
  const handleSave = async () => {
    try {
      const response = await axiosApi.post("/produtos", product);
      console.log("Produto salvo com sucesso:", response.data);
      navigate("/manage/product");
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto, verifique os dados.");
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handlePriceChange = (value?: string) => {
    value = value?.replace(',','.');
    setProduct((prev) => ({
      ...prev,
      price: value || "",
    }));
  };
  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <button
        className="mb-4 text-gray-600 hover:text-gray-800 font-medium"
        onClick={() => navigate("/manage/product")}
      >
        Voltar
      </button>
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {id === "novo" ? "Novo Produto" : "Editar Produto"}
      </h2>
      <form className="space-y-4">

        <div>
          <label className="block mb-1 font-medium text-gray-700">Nome</label>
          <input
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>


        <div>
          <label className="block mb-1 font-medium text-gray-700">Descrição</label>
          <input
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>


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

        <div>
          <label className="block mb-1 font-medium text-gray-700">Preço</label>
          <CurrencyInput
            id="price"
            name="price"
            placeholder="R$ 0,00"
            value={product.price.replace('.',',')}
            decimalsLimit={2}
            decimalScale={2}
            decimalSeparator=","
            groupSeparator="."
            prefix="R$ "
            onValueChange={handlePriceChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>


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

