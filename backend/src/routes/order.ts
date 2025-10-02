import { Router, Request, Response } from "express";
import { authenticateJWT, authorizeRoles } from "../middleware/auth";
import db from "../config/db";
import { OrderRow } from "../types/OrderRow";
import { OrderItem } from "../types/OrderItem";
import { PaymentData } from "../types/PaymentData";
import { OrderResponse } from "../types/OrderResponse";



const router = Router();

router.post("/", authenticateJWT, authorizeRoles("USER"), (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ message: "Token inválido ou expirado" });

    const { items, paymentData } = req.body as { items: OrderItem[]; paymentData: PaymentData };

    if (!items || items.length === 0) {
        return res.status(400).json({ message: "Nenhum item enviado" });
    }

    try {

        const products = db.prepare(`SELECT id, price FROM products WHERE id IN (${items.map(() => "?").join(",")})`).all(
            ...items.map((i) => i.productId)
        ) as { id: number; price: number }[];

        if (products.length !== items.length) {
            return res.status(400).json({ message: "Algum produto não existe" });
        }


        let total = 0;
        const itemsWithPrice = items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!;
            const itemTotal = product.price * item.quantity;
            total += itemTotal;
            return { ...item, value: product.price };
        });


        const insertOrder = db.prepare(`
      INSERT INTO orders (client_id, order_data, total, payment_method)
      VALUES (?, datetime('now'), ?, ?)
    `);

        const info = insertOrder.run(userId, total, "CREDIT_CARD");
        const orderId = info.lastInsertRowid as number;


        const insertOrderItem = db.prepare(`
      INSERT INTO order_item (product_id, order_id, value, quantity)
      VALUES (?, ?, ?, ?)
    `);

        for (const item of itemsWithPrice) {
            insertOrderItem.run(item.productId, orderId, item.value, item.quantity);
        }

        res.status(201).json({ orderId, total, items: itemsWithPrice });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao salvar a ordem" });
    }
});


router.get("/", authenticateJWT, (req: Request, res: Response) => {
  const user = (req as any).user;
  if (!user?.id) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }

  try {
    let rows: OrderRow[] = [];

    if (user.role === "ADMIN") {
      // Admin vê todas as ordens
      rows = db.prepare(`
        SELECT 
          o.id AS orderId,
          strftime('%d/%m/%Y', o.order_data) AS orderData,
          o.payment_method AS paymentMethod,
          o.total,
          u.name AS client,         
          oi.id AS orderItemId,
          oi.quantity,
          oi.value,
          p.name AS productName,
          p.size,
          p.scent,
          p.type
        FROM orders o
        JOIN users u ON u.id = o.client_id     
        JOIN order_item oi ON oi.order_id = o.id
        JOIN products p ON p.id = oi.product_id
      `).all() as OrderRow[];
    } else {
      // Usuário comum vê apenas suas ordens
      rows = db.prepare<OrderRow>(`
        SELECT 
          o.id AS orderId,
          strftime('%d/%m/%Y', o.order_data) AS orderData,
          o.payment_method AS paymentMethod,
          o.total,
          u.name AS client,
          oi.id AS orderItemId,
          oi.quantity,
          oi.value,
          p.name AS productName,
          p.size,
          p.scent,
          p.type
        FROM orders o
        JOIN users u ON u.id = o.client_id
        JOIN order_item oi ON oi.order_id = o.id
        JOIN products p ON p.id = oi.product_id
        WHERE o.client_id = ?
      `).all(user.id) as OrderRow[];
    }

    // Monta o array de pedidos como antes
    const orders: OrderResponse[] = rows.reduce((acc: OrderResponse[], row) => {
      let order = acc.find(o => o.id === row.orderId);
      if (!order) {
        order = {
          id: row.orderId,
          orderData: row.orderData,
          paymentMethod: row.paymentMethod,
          client: row.client,   // adiciona o nome do cliente no objeto
          items: [],
          total: row.total
        };
        acc.push(order);
      }

      order.items.push({
        id: row.orderItemId,
        productName: row.productName,
        size: row.size,
        scent: row.scent,
        type: row.type,
        quantity: row.quantity,
        value: row.value
      });

      return acc;
    }, []);

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar ordens" });
  }
});



router.get("/:id", (req: Request, res: Response) => {
    const data = db.prepare(`SELECT * FROM order WHERE id = ?`).get(req.params.id)

    res.json({});
});



export default router;
