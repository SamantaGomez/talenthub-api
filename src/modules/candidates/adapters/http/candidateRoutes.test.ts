
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
        name: "Samy Perez",
        email: "samy@example.com",
        phone: "0999999999",
        city: "Quito",
        yearsOfExperience: 0,
      })

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Samy Perez");
    expect(response.body.id).toBeDefined();
    expect(response.body.city).toBe("Quito");
    expect(response.body.yearsOfExperience).toBe(0);
    expect(response.body.skills).toEqual([]);

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
      name: "Samy Gomez",
      email: "samy@example.com",
      phone: "0988888888",
      city: "Guayaquil",
      yearsOfExperience: 1,
    });

  expect(response.status).toBe(200);
  expect(response.body.name).toBe("Samy Gomez");
  expect(response.body.city).toBe("Guayaquil");
  expect(response.body.yearsOfExperience).toBe(1);
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
  // Verifica que la ciudad sea obligatoria.
test("debe devolver 400 cuando la ciudad es inválida", async () => {
  const response = await request(app)
    .post("/candidates")
    .send({
      name: "Maria Lopez",
      email: "maria@example.com",
      phone: "0991234567",
      city: "",
      yearsOfExperience: 3,
      skills: [],
    });

  expect(response.status).toBe(400);
});

// Verifica que la experiencia no sea negativa.
test("debe devolver 400 cuando la experiencia es negativa", async () => {
  const response = await request(app)
    .post("/candidates")
    .send({
      name: "Carlos Torres",
      email: "carlos@example.com",
      phone: "0987654321",
      city: "Cuenca",
      yearsOfExperience: -1,
      skills: [],
    });

  expect(response.status).toBe(400);
});
});
