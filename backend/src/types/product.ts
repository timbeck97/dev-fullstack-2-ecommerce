import { ProductSize } from "./productSize";
import { ProductType } from "./productType";

export default interface Product{
      id?: number;
      name: string;
      description: string;
      scent: string;
      imageUrl?:string;
      type: ProductType;
      size: ProductSize;
      price: number;
}