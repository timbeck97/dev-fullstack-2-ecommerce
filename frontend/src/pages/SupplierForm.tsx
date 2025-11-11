import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosApi from "../service/axiosService";
import axios from "axios";

export interface Supplier {
    id?: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    cnpj: string;
}

export const SupplierForm = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [supplier, setSupplier] = useState<Supplier>({
        name: "",
        email: "",
        phone: "",
        address: "",
        cnpj: "",
    });

    useEffect(() => {
        if (id && id !== "novo") {
            fetchSupplier(id);
        }
    }, [id]);

    const fetchSupplier = async (id: string) => {
        try {
            const response = await axiosApi.get<Supplier>(`http://localhost:5000/suppliers/${id}`);
            setSupplier(response.data);
        } catch (err) {
            console.error(err);
            alert("Erro ao carregar fornecedor.");
        }
    };

    const handleSave = async () => {
        try {
            if (id && id !== "novo") {
                await axiosApi.put(`/suppliers/${id}`, supplier);
                alert("Fornecedor atualizado com sucesso!");
            } else {
                await axiosApi.post("/suppliers", supplier);
                alert("Fornecedor cadastrado com sucesso!");
            }
            navigate("/manage/suppliers");
        } catch (error) {
            console.error("Erro ao salvar fornecedor:", error);
            alert("Erro ao salvar fornecedor, verifique os dados.");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSupplier((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (<div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10"> 

          <button
                className="mb-4 text-gray-600 hover:text-gray-800 font-medium"
                onClick={() => navigate("/manage/suppliers")}
            >
               Voltar
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-center">
                {id === "novo" ? "Novo Fornecedor" : "Editar Fornecedor"}
            </h2>


        <form className="space-y-4">
            <div>
                <label className="block mb-1 font-medium text-gray-700">Nome</label>
                <input
                    name="name"
                    value={supplier.name}
                    onChange={handleChange}
                    placeholder="Nome do fornecedor"
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium text-gray-700">E-mail</label>
                <input
                    name="email"
                    type="email"
                    value={supplier.email}
                    onChange={handleChange}
                    placeholder="exemplo@email.com"
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium text-gray-700">Telefone</label>
                <input
                    name="phone"
                    value={supplier.phone}
                    onChange={handleChange}
                    placeholder="(00) 00000-0000"
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium text-gray-700">Cidade</label>
                <input
                    name="address"
                    value={supplier.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div>
                <label className="block mb-1 font-medium text-gray-700">CNPJ</label>
                <input
                    name="cnpj"
                    value={supplier.cnpj}
                    onChange={handleChange}
                    placeholder="00.000.000/0000-00"
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
};
