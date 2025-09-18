import { OrderItemResponse } from "./OrderItemResponse";

export interface OrderResponse {
  id: number;
  orderData: string;
  paymentMethod: string;
  total:number,
  items: OrderItemResponse[];
}