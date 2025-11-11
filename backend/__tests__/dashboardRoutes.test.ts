import request from "supertest";
import app from '../src/app'
import { NextFunction } from "express";

jest.mock("../src/config/db", () => ({
  prepare: jest.fn(() => ({
    get: jest.fn(),
    all: jest.fn(),
  })),
}));

jest.mock("../src/middleware/auth", () => ({
  authenticateJWT: (req: Request, res: Response, next: NextFunction) => next(),
  authorizeRoles: () => (req: Request, res: Response, next: NextFunction) => next(),
}));

const mockDb = require("../src/config/db");


describe("Testes das rotas de Dashboard", () => {

  // 1️⃣ total-vendas-mes
  // ---------------------------
  describe("GET /dashboard/total-vendas-mes", () => {
    it("deve retornar o total de vendas do mês (200)", async () => {
      mockDb.prepare.mockReturnValueOnce({
        get: jest.fn().mockReturnValue({ totalVendas: 12345 }),
      });

      const res = await request(app).get("/dashboard/total-vendas-mes");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ totalVendasMes: 12345 });
    });

    it("deve retornar 500 se houver erro no banco", async () => {
      mockDb.prepare.mockImplementationOnce(() => {
        throw new Error("Erro DB");
      });

      const res = await request(app).get("/dashboard/total-vendas-mes");
      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/Erro ao obter total/);
    });
  });


  describe("GET /dashboard/produto-mais-vendido", () => {
    it("deve retornar o produto mais vendido (200)", async () => {
      mockDb.prepare.mockReturnValueOnce({
        get: jest.fn().mockReturnValue({
          name: "Produto X",
          totalVendido: 50,
          totalValor: 5000,
        }),
      });

      const res = await request(app).get("/dashboard/produto-mais-vendido");
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Produto X");
      expect(res.body.totalVendido).toBe(50);
      expect(res.body.totalValor).toBe(5000);
    });

    it("deve retornar 404 se nenhum produto for encontrado", async () => {
      mockDb.prepare.mockReturnValueOnce({
        get: jest.fn().mockReturnValue(undefined),
      });

      const res = await request(app).get("/dashboard/produto-mais-vendido");
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/Nenhum produto vendido/);
    });

    it("deve retornar 500 se ocorrer erro inesperado", async () => {
      mockDb.prepare.mockImplementationOnce(() => {
        throw new Error("Erro inesperado");
      });

      const res = await request(app).get("/dashboard/produto-mais-vendido");
      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/Erro ao obter produto/);
    });
  });


  describe("GET /dashboard/baixo-estoque", () => {
    it("deve retornar produtos com baixo estoque (200)", async () => {
      mockDb.prepare.mockReturnValueOnce({
        all: jest.fn().mockReturnValue([
          { id: 1, name: "Produto A", quantity: 2 },
          { id: 2, name: "Produto B", quantity: 4 },
        ]),
      });

      const res = await request(app).get("/dashboard/baixo-estoque?minStock=5");
      expect(res.status).toBe(201);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].name).toBe("Produto A");
    });

    it("deve retornar 500 se ocorrer erro no banco", async () => {
      mockDb.prepare.mockImplementationOnce(() => {
        throw new Error("Erro DB");
      });

      const res = await request(app).get("/dashboard/baixo-estoque");
      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/Erro ao obter produtos/);
    });
  });
});