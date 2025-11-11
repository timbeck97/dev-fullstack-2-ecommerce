import request from "supertest";
import app from "../src/app";


jest.mock("../src/config/db", () => ({
  prepare: jest.fn(() => ({
    run: jest.fn(),
    all: jest.fn(),
    get: jest.fn(),
  })),
}));


jest.mock("../src/middleware/auth", () => ({
  authenticateJWT: (req: any, res: any, next: any) => next(),
  authorizeRoles: () => (req: any, res: any, next: any) => next(),
}));

const mockDb = require("../src/config/db");

describe("🧾 Testes das rotas de Fornecedores (/suppliers)", () => {


  describe("POST /suppliers", () => {
    it("deve criar um fornecedor com sucesso (201)", async () => {
      mockDb.prepare.mockReturnValueOnce({
        run: jest.fn().mockReturnValue({ lastInsertRowid: 10 }),
      });

      const res = await request(app)
        .post("/suppliers")
        .send({ name: "Fornecedor A", email: "a@email.com", cnpj: "123", address: "Rua X" });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        id: 10,
        name: "Fornecedor A",
        phone: undefined,
        email: "a@email.com",
      });
    });

    it("deve retornar 400 se o nome não for informado", async () => {
      const res = await request(app)
        .post("/suppliers")
        .send({ email: "semnome@email.com" });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/obrigatório/);
    });

    it("deve retornar 500 em erro de banco", async () => {
      mockDb.prepare.mockImplementationOnce(() => { throw new Error("DB error"); });

      const res = await request(app)
        .post("/suppliers")
        .send({ name: "Fornecedor com erro" });

      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/Erro ao criar fornecedor/);
    });
  });


  describe("GET /suppliers", () => {
    it("deve retornar a lista de fornecedores (200)", async () => {
      mockDb.prepare.mockReturnValueOnce({
        all: jest.fn().mockReturnValue([
          { id: 1, name: "Fornecedor 1" },
          { id: 2, name: "Fornecedor 2" },
        ]),
      });

      const res = await request(app).get("/suppliers");
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].name).toBe("Fornecedor 1");
    });

    it("deve retornar 500 em erro de banco", async () => {
      mockDb.prepare.mockImplementationOnce(() => { throw new Error("DB error"); });
      const res = await request(app).get("/suppliers");
      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/Erro ao buscar fornecedores/);
    });
  });


  describe("GET /suppliers/:id", () => {
    it("deve retornar um fornecedor específico (200)", async () => {
      mockDb.prepare.mockReturnValueOnce({
        get: jest.fn().mockReturnValue({ id: 5, name: "Fornecedor X" }),
      });

      const res = await request(app).get("/suppliers/5");
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Fornecedor X");
    });

    it("deve retornar 404 se o fornecedor não existir", async () => {
      mockDb.prepare.mockReturnValueOnce({
        get: jest.fn().mockReturnValue(undefined),
      });

      const res = await request(app).get("/suppliers/99");
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/não encontrado/);
    });

    it("deve retornar 500 se houver erro", async () => {
      mockDb.prepare.mockImplementationOnce(() => { throw new Error("DB error"); });
      const res = await request(app).get("/suppliers/1");
      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/Erro ao buscar fornecedor/);
    });
  });


  describe("PUT /suppliers/:id", () => {
    it("deve atualizar um fornecedor (200)", async () => {
      mockDb.prepare
        .mockReturnValueOnce({ get: jest.fn().mockReturnValue({ id: 1, name: "Antigo" }) }) // SELECT existente
        .mockReturnValueOnce({ run: jest.fn() }); // UPDATE

      const res = await request(app)
        .put("/suppliers/1")
        .send({ name: "Novo Nome", phone: "123" });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Novo Nome");
    });

    it("deve retornar 404 se o fornecedor não existir", async () => {
      mockDb.prepare.mockReturnValueOnce({
        get: jest.fn().mockReturnValue(undefined),
      });

      const res = await request(app)
        .put("/suppliers/10")
        .send({ name: "Teste" });

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/não encontrado/);
    });

    it("deve retornar 400 se o nome estiver ausente", async () => {
      const res = await request(app)
        .put("/suppliers/1")
        .send({ phone: "9999" });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/obrigatório/);
    });

    it("deve retornar 500 em erro inesperado", async () => {
      mockDb.prepare.mockImplementationOnce(() => { throw new Error("DB error"); });
      const res = await request(app)
        .put("/suppliers/1")
        .send({ name: "Fornecedor com erro" });

      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/Erro ao atualizar fornecedor/);
    });
  });

  describe("DELETE /suppliers/:id", () => {
    it("deve deletar um fornecedor existente (200)", async () => {
      mockDb.prepare
        .mockReturnValueOnce({ get: jest.fn().mockReturnValue({ id: 3 }) }) // SELECT
        .mockReturnValueOnce({ run: jest.fn() }); // DELETE

      const res = await request(app).delete("/suppliers/3");
      expect(res.status).toBe(200);
      expect(res.body.message).toMatch(/removido com sucesso/);
    });

    it("deve retornar 404 se o fornecedor não existir", async () => {
      mockDb.prepare.mockReturnValueOnce({
        get: jest.fn().mockReturnValue(undefined),
      });

      const res = await request(app).delete("/suppliers/999");
      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/não encontrado/);
    });

    it("deve retornar 500 se ocorrer erro no banco", async () => {
      mockDb.prepare.mockImplementationOnce(() => { throw new Error("DB error"); });
      const res = await request(app).delete("/suppliers/1");
      expect(res.status).toBe(500);
      expect(res.body.message).toMatch(/Erro ao deletar fornecedor/);
    });
  });
});
