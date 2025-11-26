import express, { Request, Response } from "express";
import db from '../config/db'
import { authenticateJWT, authorizeRoles } from '../middleware/auth'

const router = express.Router();


router.get("/total-vendas-mes", authenticateJWT, authorizeRoles("ADMIN"), (req: Request, res: Response) => {
    try {
        const result = db.prepare(`
      SELECT 
        IFNULL(SUM(total), 0) as totalVendas
      FROM orders
      WHERE strftime('%Y-%m', order_data) = strftime('%Y-%m', 'now')
    `).get() as { totalVendas: number };

        res.json({ totalVendasMes: result.totalVendas });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao obter total de vendas no mês" });
    }
});


router.get("/produto-mais-vendido", authenticateJWT, authorizeRoles("ADMIN"), (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        const start = startDate || "datetime('now', '-30 day')";
        const end = endDate || "datetime('now')";

        const result = db.prepare(`
      SELECT 
        p.name,
        SUM(oi.quantity) as totalVendido,
        SUM(oi.value * oi.quantity) as totalValor
      FROM order_item oi
      JOIN products p ON p.id = oi.product_id
      JOIN orders o ON o.id = oi.order_id
      WHERE o.order_data BETWEEN ${startDate ? `'${start}'` : start} AND ${endDate ? `'${end}'` : end}
      GROUP BY p.id
      ORDER BY totalVendido DESC
      LIMIT 1
    `).get() as { name: string; totalVendido: number; totalValor: number } | undefined;

        if (!result) {
            return res.status(404).json({ message: "Nenhum produto vendido no período informado" });
        }

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao obter produto mais vendido" });
    }
});


router.get("/baixo-estoque", authenticateJWT, authorizeRoles("ADMIN"), (req: Request, res: Response) => {
    try {
        const minStock = Number(req.query.minStock) || 3;

        const products = db.prepare(`
      SELECT id, name, quantity
      FROM products
      WHERE quantity <= ?
      ORDER BY quantity ASC
    `).all(minStock) as { id: number; name: string; quantity: number }[];

        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao obter produtos com baixo estoque" });
    }
});

export default router;
