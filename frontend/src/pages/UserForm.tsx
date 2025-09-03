import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export interface User {
    id?: number;
    name: string;
    lastName: string;
    cpf: string;
    birthDate: string; // YYYY-MM-DD
}

export function UserForm() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [user, setUser] = useState<User>({
        name: "",
        lastName: "",
        cpf: "",
        birthDate: "",
    });

    useEffect(() => {
        if (id && id !== "novo") {
            const numericId = parseInt(id, 10);
            // Simulação de fetch
            const fetchedUser: User = {
                id: numericId,
                name: "João",
                lastName: "Silva",
                cpf: "123.456.789-00",
                birthDate: "1990-05-20",
            };
            setUser(fetchedUser);
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Salvar usuário:", user);
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            {/* Botão Voltar */}
            <button
                className="mb-4 text-gray-600 hover:text-gray-800 font-medium"
                onClick={() => navigate("/users")}
            >
               Voltar
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-center">
                {id === "novo" ? "Novo Usuário" : "Editar Usuário"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nome */}
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Nome</label>
                    <input
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Sobrenome */}
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Sobrenome</label>
                    <input
                        name="lastName"
                        value={user.lastName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* CPF */}
                <div>
                    <label className="block mb-1 font-medium text-gray-700">CPF</label>
                    <input
                        name="cpf"
                        value={user.cpf}
                        onChange={handleChange}
                        placeholder="000.000.000-00"
                        className="w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Data de nascimento */}
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Data de Nascimento</label>
                    <input
                        type="date"
                        name="birthDate"
                        value={user.birthDate}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Botão Salvar */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                >
                    Salvar
                </button>
            </form>
        </div>
    );
}
