import { Router, Request, Response } from "express";
import { authenticateJWT, authorizeRoles } from "../middleware/auth";
import db from "../config/db";

const router = Router();

router.post("/", authenticateJWT, authorizeRoles("ADMIN"), (req: Request, res: Response) => {
const { name, phone, email, cnpj, address } = req.body;

if (!name) {
return res.status(400).json({ message: "O nome do fornecedor é obrigatório" });
}

try {
const stmt = db.prepare(`       INSERT INTO suppliers (name, phone, email, cnpj, address)
      VALUES (?, ?, ?,?,?)
    `);
const info = stmt.run(name, phone || null, email, cnpj,address);


res.status(201).json({
  id: info.lastInsertRowid,
  name,
  phone,
  email,
});


} catch (err) {
console.error(err);
res.status(500).json({ message: "Erro ao criar fornecedor" });
}
});


router.get("/", authenticateJWT, (req: Request, res: Response) => {
try {
const suppliers = db.prepare(`SELECT * FROM suppliers ORDER BY id DESC`).all();
res.json(suppliers);
} catch (err) {
console.error(err);
res.status(500).json({ message: "Erro ao buscar fornecedores" });
}
});


router.get("/:id", authenticateJWT, authorizeRoles("ADMIN"),(req: Request, res: Response) => {
try {
const supplier = db.prepare(`SELECT * FROM suppliers WHERE id = ?`).get(req.params.id);


if (!supplier) {
  return res.status(404).json({ message: "Fornecedor não encontrado" });
}

res.json(supplier);


} catch (err) {
console.error(err);
res.status(500).json({ message: "Erro ao buscar fornecedor" });
}
});


router.put("/:id", authenticateJWT, authorizeRoles("ADMIN"), (req: Request, res: Response) => {
const { name, phone, email, address, cnpj } = req.body;

if (!name) {
return res.status(400).json({ message: "O nome do fornecedor é obrigatório" });
}

try {
const supplier = db.prepare(`SELECT * FROM suppliers WHERE id = ?`).get(req.params.id);
if (!supplier) {
return res.status(404).json({ message: "Fornecedor não encontrado" });
}


const stmt = db.prepare(`
  UPDATE suppliers
  SET name = ?, phone = ?, email = ?, cnpj=?, address=?
  WHERE id = ?
`);
stmt.run(name, phone || null, email || null, cnpj||null, address||null, req.params.id);

res.json({ id: req.params.id, name, phone, email });


} catch (err) {
console.error(err);
res.status(500).json({ message: "Erro ao atualizar fornecedor" });
}
});


router.delete("/:id", authenticateJWT, authorizeRoles("ADMIN"), (req: Request, res: Response) => {
try {
const supplier = db.prepare(`SELECT * FROM suppliers WHERE id = ?`).get(req.params.id);
if (!supplier) {
return res.status(404).json({ message: "Fornecedor não encontrado" });
}


db.prepare(`DELETE FROM suppliers WHERE id = ?`).run(req.params.id);

res.json({ message: "Fornecedor removido com sucesso" });


} catch (err) {
console.error(err);
res.status(500).json({ message: "Erro ao deletar fornecedor" });
}
});

export default router;
