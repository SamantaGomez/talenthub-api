
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

  // Conectar únicamente a la base de pruebas.
  beforeAll(async () => {
    const databaseUrl = process.env.DATABASE_URL;
    const testDatabaseUrl = process.env.TEST_DATABASE_URL;

    if (!databaseUrl || !testDatabaseUrl) {
      throw new Error(
        "DATABASE_URL y TEST_DATABASE_URL deben estar configuradas"
      );
    }

    const development = new URL(databaseUrl.trim());
    const testing = new URL(testDatabaseUrl.trim());

    // Comprobar que las conexiones no apunten a la misma base.
    const databaseIdentity = (url: URL): string =>
      [
        url.hostname.toLowerCase(),
        url.port || "5432",
        decodeURIComponent(url.pathname),
      ].join(":");

    if (
      databaseIdentity(development) ===
      databaseIdentity(testing)
    ) {
      throw new Error(
        "La base de datos de pruebas debe ser diferente a la de desarrollo"
      );
    }

    pool = createPostgresPool(testDatabaseUrl);
    repository = new PostgresCandidateRepository(pool);

    // Comprobar que la conexión funciona.
    await pool.query("SELECT 1");
  });

  // Limpiar solamente la tabla de pruebas.
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
    expect(await repository.findAll()).toEqual([]);
  });

  test("debe guardar un candidato y generar su ID", async () => {
    const saved = await repository.save(sampleCandidate);

    expect(saved).toEqual({
      id: 1,
      ...sampleCandidate,
      skills: [],
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
      skills: [],
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

  // Nueva prueba 1: persistencia de habilidades.
  test("debe guardar y recuperar las habilidades sin cambios", async () => {
    const saved = await repository.save({
      ...sampleCandidate,
      skills: ["TypeScript", "SQL"],
    });

    const result = await repository.findById(saved.id);

    expect(saved.skills).toEqual(["TypeScript", "SQL"]);
    expect(result?.skills).toEqual(["TypeScript", "SQL"]);
  });

  // Nueva prueba 2: actualización de habilidades.
  test("debe actualizar las habilidades en PostgreSQL", async () => {
    const saved = await repository.save({
      ...sampleCandidate,
      skills: ["JavaScript"],
    });

    const updated = await repository.update(saved.id, {
      ...sampleCandidate,
      skills: ["TypeScript", "PostgreSQL"],
    });

    expect(updated?.skills).toEqual(["TypeScript", "PostgreSQL"]);

    const result = await repository.findById(saved.id);

    expect(result?.skills).toEqual(["TypeScript", "PostgreSQL"]);
  });
});
