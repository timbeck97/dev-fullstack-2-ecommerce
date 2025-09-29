import { ProductScent } from "./ProductScent";
import { ProductSize } from "./ProductSize";
import { ProductType } from "./ProductType";

export default interface ProductCard {
  id: number;
  name: string;
  description: string;
  scent: ProductScent;
  type: ProductType;
  size: ProductSize;
  imageUrl?:string;
  price: string;
}
