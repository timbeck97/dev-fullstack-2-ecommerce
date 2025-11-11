import express from "express";
import cors from "cors";
import path from "path";
import usuariosRouter from "./routes/users";
import produtosRouter from "./routes/products";
import authRouter from "./routes/users";
import orderRouter from "./routes/order";
import supplierRouter from "./routes/supplier";
import dashboardsRouter from "./routes/dashboard";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/usuarios", usuariosRouter);
app.use("/produtos", produtosRouter);
app.use("/order", orderRouter);
app.use("/auth", authRouter);
app.use("/suppliers", supplierRouter);
app.use("/dashboard", dashboardsRouter);

export default app;