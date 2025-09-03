export const Menu = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">


                    <div className="flex-shrink-0 text-2xl font-bold text-gray-800">
                        Loja de Aromas
                    </div>


                    <nav className="flex items-center space-x-6">
                        <a href="/login" className="text-gray-700 hover:text-gray-900">
                            Login
                        </a>
                        <a href="/meus-pedidos" className="text-gray-700 hover:text-gray-900">
                            Meus Pedidos
                        </a>
                        <a href="/carrinho" className="text-gray-700 hover:text-gray-900">

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.6 8h13.2L17 13M7 13H5.4M17 13l1.6 8M9 21h6"
                                />
                            </svg>
                        </a>
                    </nav>

                </div>
            </div>
        </header>
    );
}
