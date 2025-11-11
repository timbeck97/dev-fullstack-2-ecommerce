import { Router, Request, Response } from "express";
import { authenticateJWT, authorizeRoles } from "../middleware/auth";
import db from "../config/db";
import multer from "multer";
import fs from "fs";
import path from "path";
import { ProductType } from "../types/productType";
import { ProductSize } from "../types/productSize";
import Product from "../types/product";

const uploadDir = path.join(__dirname, "../../uploads"); 
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // mesmo caminho usado no static
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });
const router = Router();


router.post(
  "/",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  upload.single("image"), // multer para receber o arquivo
  (req: Request, res: Response) => {
    const { name, description, scent, type, size, price, supplierId, quantity } = req.body;
    const file = req.file;

    // validações
    if (!name || !description || !scent || !type || !size || price == null || supplierId == null || quantity==null) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    if (!Object.values(ProductType).includes(type)) {
      return res.status(400).json({
        error: `Tipo inválido. Valores permitidos: ${Object.values(ProductType).join(", ")}`,
      });
    }

    if (!Object.values(ProductSize).includes(size)) {
      return res.status(400).json({
        error: `Tamanho inválido. Valores permitidos: ${Object.values(ProductSize).join(", ")}`,
      });
    }

    const imageUrl = file ? `/uploads/${file.filename}` : null;
 
    const result = db
      .prepare(
        `
      INSERT INTO products (name, description, scent, type, size, price, imageUrl, supplierId, quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
      )
      .run(name, description, scent, type, size, price, imageUrl, supplierId, quantity);

    const newProduct = db
      .prepare(`SELECT * FROM products WHERE id = ?`)
      .get(result.lastInsertRowid);

    res.status(201).json(newProduct);
  }
);


router.get("/", (req: Request, res: Response) => {
  let products = db.prepare(`SELECT * FROM products`).all() as Product[];
  const { name } = req.query;
  if (name) {
    products = products.filter(p => p.name.toLowerCase().includes(String(name).toLowerCase()));
  }

  res.json(products);
});


router.get("/:id", (req: Request, res: Response) => {
  const product = db.prepare(`SELECT * FROM products WHERE id = ?`).get(req.params.id) as Product | undefined;
  if (!product) return res.status(404).json({ error: "Produto não encontrado" });
  res.json(product);
});


router.put(
  "/:id",
  authenticateJWT,
  authorizeRoles("ADMIN"),
  upload.single("image"), // multer para receber imagem
  (req: Request, res: Response) => {
    const { id } = req.params;
    const existing = db.prepare(`SELECT * FROM products WHERE id = ?`).get(id) as Product | undefined;
    if (!existing) return res.status(404).json({ error: "Produto não encontrado" });

    const { name, description, scent, type, size, price, supplierId, quantity } = req.body;
    const file = req.file;
    if (type && !Object.values(ProductType).includes(type)) {
      return res.status(400).json({
        error: `Tipo inválido. Valores permitidos: ${Object.values(ProductType).join(", ")}`,
      });
    }

    if (size && !Object.values(ProductSize).includes(size)) {
      return res.status(400).json({
        error: `Tamanho inválido. Valores permitidos: ${Object.values(ProductSize).join(", ")}`,
      });
    }

    // se enviar uma nova imagem, atualiza a URL, senão mantém a existente
    const imageUrl = file ? `/uploads/${file.filename}` : existing.imageUrl;

    db.prepare(
      `
      UPDATE products
      SET name = ?, description = ?, scent = ?, type = ?, size = ?, price = ?, imageUrl = ?, supplierId=?, quantity=?
      WHERE id = ?
    `
    ).run(
      name || existing.name,
      description || existing.description,
      scent || existing.scent,
      type || existing.type,
      size || existing.size,
      price ?? existing.price,
      imageUrl,
      supplierId || existing.supplierId,
      quantity || existing.quantity,
      id
    );

    const updated = db.prepare(`SELECT * FROM products WHERE id = ?`).get(id) as Product;
    res.json(updated);
  }
);


router.delete("/:id", authenticateJWT, authorizeRoles('ADMIN'), (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = db.prepare(`SELECT * FROM products WHERE id = ?`).get(id) as Product | undefined;
  if (!existing) return res.status(404).json({ error: "Produto não encontrado" });

  db.prepare(`DELETE FROM products WHERE id = ?`).run(id);
  res.status(204).send();
});

export default router;
