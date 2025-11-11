import { useEffect, useState } from "react";
import axiosApi from "../service/axiosService";

interface ProductEstoque {
    id: number;
    name: string;
    quantity: number;
}

interface ProdutoMaisVendido {
    name: string;
    totalVendido: number;
    totalValor: number;
}

export const ResultPanel = () => {
    const [totalVendasMes, setTotalVendasMes] = useState<number | null>(null);
    const [produtoMaisVendido, setProdutoMaisVendido] = useState<ProdutoMaisVendido | null>(null);
    const [produtosBaixoEstoque, setProdutosBaixoEstoque] = useState<ProductEstoque[]>([]);
    const [loading, setLoading] = useState(true);

    // 🔹 Campos de filtro
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const vendasRes = await axiosApi.get("/dashboard/total-vendas-mes");
            setTotalVendasMes(vendasRes.data.totalVendasMes);
            await buscarProdutoMaisVendido();
            const estoqueRes = await axiosApi.get("/dashboard/baixo-estoque?minStock=5");
            setProdutosBaixoEstoque(estoqueRes.data);
        } catch (err) {
            console.error("Erro ao carregar dashboard:", err);
        } finally {
            setLoading(false);
        }
    };

    const buscarProdutoMaisVendido = async () => {
        try {
            const params: any = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;
            const res = await axiosApi.get("/dashboard/produto-mais-vendido", { params });
            setProdutoMaisVendido(res.data);
        } catch (err) {
            console.error("Erro ao buscar produto mais vendido:", err);
            setProdutoMaisVendido(null);
        }
    };

    if (loading) {
        return <div className="text-center text-gray-600 mt-10">Carregando dados...</div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h2 className="text-2xl font-semibold mb-6 text-center text-blue-700">📊 Dashboard de Vendas</h2>


            <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-700 mb-2">💰 Total de Vendas no Mês</h3>
                <p className="text-2xl font-semibold text-green-600">
                    {totalVendasMes !== null ? `R$ ${totalVendasMes.toFixed(2)}` : "N/A"}
                </p>
            </div>


            <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-700 mb-4">🔥 Produto Mais Vendido</h3>


                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="flex flex-col w-full">
                        <label
                            htmlFor="startDate"
                            className="text-sm font-medium text-gray-600 mb-1"
                        >
                            Data Início
                        </label>
                        <input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="flex flex-col w-full">

                        <label
                            htmlFor="endDate"
                            className="text-sm font-medium text-gray-600 mb-1"
                        >
                            Data Fim
                        </label>
                        <input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={buscarProdutoMaisVendido}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition h-[42px]"
                        >
                            Buscar
                        </button>
                    </div>
                </div>

                {produtoMaisVendido ? (
                    <div>
                        <p className="font-semibold text-gray-800">{produtoMaisVendido.name}</p>
                        <p>Quantidade vendida: {produtoMaisVendido.totalVendido}</p>
                        <p>Faturamento: R$ {produtoMaisVendido.totalValor.toFixed(2)}</p>
                    </div>
                ) : (
                    <p className="text-gray-500">Nenhum produto encontrado no período selecionado.</p>
                )}
            </div>


            <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium text-gray-700 mb-2">⚠️ Produtos com Baixo Estoque</h3>
                {produtosBaixoEstoque.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {produtosBaixoEstoque.map((p) => (
                            <li key={p.id} className="py-2 flex justify-between">
                                <span>{p.name}</span>
                                <span className="text-red-500 font-medium">{p.quantity} unid.</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">Nenhum produto com baixo estoque.</p>
                )}
            </div>
        </div>
    );
};
