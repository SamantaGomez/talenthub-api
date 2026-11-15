
import express from "express";
import request from "supertest";

import { CandidateService } from "../../application/CandidateService";
import { InMemoryCandidateRepository } from "../persistence/InMemoryCandidateRepository";
import { createCandidateRouter } from "./candidateRoutes";

import { errorHandler, notFoundHandler } from "../../../../shared/httpErrorHandlers";

describe("Candidate HTTP Routes", () => {
  const app = express();

  app.use(express.json());

  const repository = new InMemoryCandidateRepository();
  const service = new CandidateService(repository);

  app.use("/candidates", createCandidateRouter(service));
  app.use(notFoundHandler);
  app.use(errorHandler);

  let candidateId: number;

  it("GET /candidates devuelve una lista", async () => {
    const response = await request(app).get("/candidates");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("POST /candidates crea un candidato", async () => {
    const response = await request(app)
      .post("/candidates")
      .send({
        name: "Ana Perez",
        email: "ana@example.com",
        phone: "0999999999",
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Ana Perez");
    expect(response.body.id).toBeDefined();

    candidateId = response.body.id;
  });

  it("GET /candidates/:id obtiene un candidato", async () => {
    const response = await request(app).get(
      `/candidates/${candidateId}`
    );

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(candidateId);
  });

  it("PUT /candidates/:id actualiza un candidato", async () => {
    const response = await request(app)
      .put(`/candidates/${candidateId}`)
      .send({
        name: "Ana Gomez",
        email: "ana@example.com",
        phone: "0988888888",
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Ana Gomez");
  });

  it("DELETE /candidates/:id elimina un candidato", async () => {
    const response = await request(app).delete(
      `/candidates/${candidateId}`
    );

    expect(response.status).toBe(204);
  });

  it("GET /candidates/:id devuelve 404 si no existe", async () => {
    const response = await request(app).get("/candidates/99999");

    expect(response.status).toBe(404);
  });

  it("GET /candidates/:id rechaza identificadores invalidos", async () => {
    const response = await request(app).get("/candidates/abc");

    expect(response.status).toBe(400);
  });

  it("POST /candidates rechaza datos invalidos", async () => {
    const response = await request(app)
      .post("/candidates")
      .send({
        name: "",
        email: "correo-invalido",
        phone: "",
      });

    expect(response.status).toBe(400);
  });

  it("GET /candidates devuelve una lista despues de eliminar", async () => {
    const response = await request(app).get("/candidates");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
