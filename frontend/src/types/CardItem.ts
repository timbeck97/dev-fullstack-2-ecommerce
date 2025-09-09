import ProductCard from "./ProductCard";

export default interface CartItem extends ProductCard {
  quantity: number;
}