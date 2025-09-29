import express, { Request, Response } from "express";
import cors from "cors";
import usuariosRouter from "./routes/users";
import produtosRouter from "./routes/products";
import authRouter from "./routes/users";
import orderRouter from './routes/order'
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/usuarios", usuariosRouter);
app.use("/produtos", produtosRouter);
app.use("/order", orderRouter);
app.use("/auth", authRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(` Backend rodando em http://localhost:${PORT}`);
});	
