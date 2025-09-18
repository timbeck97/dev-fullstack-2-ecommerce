import CartItem from "./CardItem";
import { OrderItem } from "./OrderItem";
import ProductCard from "./ProductCard";

export default interface Order {
    id:number,
    items:OrderItem[],
    orderData:string,
    user:string,
    total:number
}