import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import ProductCard from "../types/ProductCard";

export interface CartItem extends ProductCard {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: ProductCard, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  totalQuantity: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);


  useEffect(() => {
    const stored = localStorage.getItem("shoppingCart");
    if (stored) setCartItems(JSON.parse(stored));
  }, []);

  
  useEffect(() => {
    localStorage.setItem("shoppingCart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: ProductCard, quantity=1) => {
    setCartItems((prev) => {
      const index = prev.findIndex((i) => i.id === item.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index].quantity += quantity;
        return updated;
      } else {
        console.log(item, quantity)
        return [...prev, { ...item, quantity }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalQuantity }}>
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart deve ser usado dentro de CartProvider");
  return context;
};
