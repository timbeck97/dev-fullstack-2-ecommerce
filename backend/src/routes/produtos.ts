import { Router, Request, Response } from "express";

const router = Router();

enum ProductType {
  VELA = "VELA",
  DIFUSOR = "DIFUSOR",
  HOME_SPRAY = "HOME_SPRAY",
  ESSENCIA = "ESSENCIA"
}

enum ProductSize {
  UNICO = "UNICO",
  G200 = "200G",
  G100 = "100G",
  ML45 = "45ML",
  ML250 = "250ML",
  ML500 = "500ML"
}

interface Product {
  id?: number;
  name: string;
  description: string;
  scent: string;
  type: ProductType;
  size: ProductSize;
  price: number;
}

let products: Product[] = [];
let sequence = 1;


router.post("/", (req: Request, res: Response) => {
  const { name, description, scent, type, size, price } = req.body;


  if (!name || !description || !scent || !type || !size || price == null) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  if (!Object.values(ProductType).includes(type)) {
    return res.status(400).json({ error: `Tipo inválido. Valores permitidos: ${Object.values(ProductType).join(", ")}` });
  }

  if (!Object.values(ProductSize).includes(size)) {
    return res.status(400).json({ error: `Tamanho inválido. Valores permitidos: ${Object.values(ProductSize).join(", ")}` });
  }

  const newProduct: Product = {
    id: sequence++,
    name,
    description,
    scent,
    type,
    size,
    price
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});


router.get("/", (req: Request, res: Response) => {
  let productResponse:Product[]=products
  let {name} = req.query
  if(name){
    productResponse = productResponse.filter(p=>p.name.toLowerCase().includes(String(name).toLowerCase())) 
  }
  res.json(productResponse);
});


router.get("/:id", (req: Request, res: Response) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: "Produto não encontrado" });
  res.json(product);
});


router.put("/:id", (req: Request, res: Response) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: "Produto não encontrado" });

  const { name, description, scent, type, size, price } = req.body;

  if (type && !Object.values(ProductType).includes(type)) {
    return res.status(400).json({ error: `Tipo inválido. Valores permitidos: ${Object.values(ProductType).join(", ")}` });
  }

  if (size && !Object.values(ProductSize).includes(size)) {
    return res.status(400).json({ error: `Tamanho inválido. Valores permitidos: ${Object.values(ProductSize).join(", ")}` });
  }

  product.name = name || product.name;
  product.description = description || product.description;
  product.scent = scent || product.scent;
  product.type = type || product.type;
  product.size = size || product.size;
  product.price = price ?? product.price;

  res.json(product);
});


router.delete("/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (!products.find(p => p.id === id)) {
    return res.status(404).json({ error: `Produto ${id} não encontrado` });
  }
  products = products.filter(p => p.id !== id);
  res.status(204).send();
});

export default router;
