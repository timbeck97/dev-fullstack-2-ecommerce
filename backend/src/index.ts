import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/teste", (req: Request, res: Response) => {
  res.json({ message: "Olá requisicao de teste Reactjs + express!" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(` Backend rodando em http://localhost:${PORT}`);
});	
