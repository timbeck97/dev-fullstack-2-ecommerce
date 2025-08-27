import express, { Request, Response } from "express";
import cors from "cors";
import usuariosRouter from "./routes/usuarios";
import produtosRouter from "./routes/produtos";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/usuarios", usuariosRouter);
app.use("/produtos", produtosRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(` Backend rodando em http://localhost:${PORT}`);
});	
