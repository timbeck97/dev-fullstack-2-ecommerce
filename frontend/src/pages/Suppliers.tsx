import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosApi from "../service/axiosService";
import { AuthContext } from "../context/AuthContext";
import { Supplier } from "../types/Supplier";



export const Suppliers = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchSuppliers = async () => {
        try {
            const response = await axiosApi.get("suppliers");
            setSuppliers(response.data);
        } catch (err) {
            console.error(err);
            setError("Erro ao carregar fornecedores.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleDelete = async (id?: number) => {
        if (!id) return;
        if (!window.confirm("Deseja realmente excluir este fornecedor?")) return;


        try {
            await axiosApi.delete(`http://localhost:5000/suppliers/${id}`);
            setSuppliers((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error(err);
            setError("Erro ao excluir fornecedor.");
        }


    };

    if (loading) return <div className="p-10 text-center">Carregando fornecedores...</div>;

    return (<div className="mx-10 mt-10"> <div className="flex justify-between items-center mb-4"> <h2 className="text-2xl font-semibold">Fornecedores</h2>


        {user?.role === "ADMIN" && (
            <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                onClick={() => navigate("/manage/suppliers/novo")}
            >
                Adicionar Novo
            </button>
        )}
    </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4 border-b">ID</th>
                        <th className="py-2 px-4 border-b">Nome</th>
                        <th className="py-2 px-4 border-b">Telefone</th>
                        <th className="py-2 px-4 border-b">Email</th>
                        <th className="py-2 px-4 border-b">Criado em</th>
                        {user?.role === "ADMIN" && <th className="py-2 px-4 border-b">Ações</th>}
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b">{s.id}</td>
                            <td className="py-2 px-4 border-b">{s.name}</td>
                            <td className="py-2 px-4 border-b">{s.phone || "-"}</td>
                            <td className="py-2 px-4 border-b">{s.email || "-"}</td>
                            <td className="py-2 px-4 border-b">
                                {s.created_at ? new Date(s.created_at).toLocaleDateString() : "-"}
                            </td>
                            {user?.role === "ADMIN" && (
                                <td className="py-2 px-4 border-b space-x-2">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                                        onClick={() => navigate(`/manage/suppliers/${s.id}`)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                                        onClick={() => handleDelete(s.id)}
                                    >
                                        Excluir
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                    {suppliers.length === 0 && (
                        <tr>
                            <td
                                colSpan={user?.role === "ADMIN" ? 6 : 5}
                                className="text-center py-4 text-gray-500"
                            >
                                Nenhum fornecedor encontrado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
    );

};
