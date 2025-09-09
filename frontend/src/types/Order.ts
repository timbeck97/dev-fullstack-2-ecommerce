import CartItem from "./CardItem";
import ProductCard from "./ProductCard";

export default interface Order {
    id:number,
    itens:CartItem[],
    date:Date,
    user:string,
    total:number
}