
import "dotenv/config";

import { Pool } from "pg";

import { createPostgresPool } from "../../../../shared/database/postgresPool";
import { PostgresCandidateRepository } from "./PostgresCandidateRepository";

// Datos de ejemplo para las pruebas.
const sampleCandidate = {
  name: "Ana Gomez",
  email: "ana@gmail.com",
  phone: "0991234567",
};

describe("PostgresCandidateRepository", () => {
  let pool: Pool;
  let repository: PostgresCandidateRepository;

  // Conectar a la base de datos de pruebas.
  beforeAll(() => {
    if (!process.env.TEST_DATABASE_URL) {
      throw new Error("TEST_DATABASE_URL no está configurada");
    }

    pool = createPostgresPool(process.env.TEST_DATABASE_URL);
    repository = new PostgresCandidateRepository(pool);
  });

  // Limpiar la tabla antes de cada prueba.
  beforeEach(async () => {
    await pool.query("TRUNCATE candidates RESTART IDENTITY");
  });

  // Cerrar la conexión al finalizar.
  afterAll(async () => {
    if (pool) {
      await pool.end();
    }
  });

  test("debe iniciar sin candidatos", async () => {
    const result = await repository.findAll();

    expect(result).toEqual([]);
  });

  test("debe guardar un candidato y generar su ID", async () => {
    const saved = await repository.save(sampleCandidate);

    expect(saved).toEqual({
      id: 1,
      ...sampleCandidate,
    });
  });

  test("debe listar los candidatos registrados", async () => {
    await repository.save(sampleCandidate);

    const second = await repository.save({
      name: "Carlos Perez",
      email: "carlos@gmail.com",
      phone: "0987654321",
    });

    const result = await repository.findAll();

    expect(result).toHaveLength(2);
    expect(second.id).toBe(2);
  });

  test("debe buscar un candidato por ID", async () => {
    const saved = await repository.save(sampleCandidate);

    const result = await repository.findById(saved.id);

    expect(result).toEqual(saved);
  });

  test("debe devolver undefined si el candidato no existe", async () => {
    const result = await repository.findById(999);

    expect(result).toBeUndefined();
  });

  test("debe actualizar un candidato existente", async () => {
    const saved = await repository.save(sampleCandidate);

    const updated = await repository.update(saved.id, {
      name: "Ana Robles",
      email: "ana.robles@gmail.com",
      phone: "0987654321",
    });

    expect(updated).toEqual({
      id: saved.id,
      name: "Ana Robles",
      email: "ana.robles@gmail.com",
      phone: "0987654321",
    });
  });

  test("debe devolver undefined al actualizar uno inexistente", async () => {
    const result = await repository.update(999, sampleCandidate);

    expect(result).toBeUndefined();
  });

  test("debe eliminar un candidato existente", async () => {
    const saved = await repository.save(sampleCandidate);

    const removed = await repository.remove(saved.id);

    expect(removed).toBe(true);
    expect(await repository.findAll()).toEqual([]);
  });

  test("debe devolver false al eliminar uno inexistente", async () => {
    const result = await repository.remove(999);

    expect(result).toBe(false);
  });
});
