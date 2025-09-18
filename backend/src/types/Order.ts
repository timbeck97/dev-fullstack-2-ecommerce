import { OrderItem } from "./OrderItem";

export interface Order {
    id: number;
    orderData: string;
    paymentMethod: string;
    items: OrderItem[];
    total: number
}