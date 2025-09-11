import Routes from "./routes/Routes";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

function App() {


  return (
    <div className="bg-gray-100 min-h-screen w-full">
      <AuthProvider>
        <CartProvider>
          <Routes />
        </CartProvider>
      </AuthProvider>
      
    </div>
  );
}

export default App;