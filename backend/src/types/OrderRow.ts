export interface OrderRow {
    orderId: number;
    orderData: string;
    total: number,
    paymentMethod: string;
    orderItemId: number;
    quantity: number;
    value: number;
    productName: string;
    size: string;
    scent: string;
    type: string;
    client:string;
}