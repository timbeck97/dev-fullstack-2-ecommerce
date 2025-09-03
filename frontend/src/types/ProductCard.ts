import { ProductScent } from "./ProductScent";
import { ProductSize } from "./ProductSize";
import { ProductType } from "./ProductType";

export default interface Product {
  id: number;
  name: string;
  description: string;
  scent: ProductScent;
  type: ProductType;
  size: ProductSize;
  price: string;
}
