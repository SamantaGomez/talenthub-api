
import { InMemoryCandidateRepository } from "./InMemoryCandidateRepository";

describe("InMemoryCandidateRepository", () => {
  let repository: InMemoryCandidateRepository;

  const candidateData = {
  name: "Samy Gomez",
  email: "samy@gmail.com",
  phone: "0991234567",
  city: "Quito",
  yearsOfExperience: 3,
};

  beforeEach(() => {
    repository = new InMemoryCandidateRepository();
  });

  test("debe iniciar sin candidatos", async () => {
    expect(await repository.findAll()).toEqual([]);
  });

  test("debe guardar un candidato", async () => {
    const candidate = await repository.save(candidateData);

    expect(candidate).toEqual({
      id: 1,
      ...candidateData,
      skills: [],
    });
  });

  test("debe listar los candidatos registrados", async () => {
    await repository.save(candidateData);

    const result = await repository.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe(candidateData.name);
    expect(result[0].skills).toEqual([]);
  });

  test("debe buscar un candidato por ID", async () => {
    const candidate = await repository.save(candidateData);

    const result = await repository.findById(candidate.id);

    expect(result).toEqual(candidate);
  });

  test("debe devolver undefined si el candidato no existe", async () => {
    expect(await repository.findById(99)).toBeUndefined();
  });

  test("debe actualizar un candidato existente", async () => {
    const candidate = await repository.save(candidateData);

    const updated = await repository.update(candidate.id, {
  name: "Carlin Robles",
  email: "carlin.robles@gmail.com",
  phone: "0987654321",
  city: "Cuenca",
  yearsOfExperience: 5,
});

    expect(updated).toEqual({
  id: 1,
  name: "Carlin Robles",
  email: "carlin.robles@gmail.com",
  phone: "0987654321",
  city: "Cuenca",
  yearsOfExperience: 5,
  skills: [],
});
  });

  test("debe devolver undefined al actualizar uno inexistente", async () => {
    const result = await repository.update(99, candidateData);

    expect(result).toBeUndefined();
  });

  test("debe eliminar un candidato existente", async () => {
    const candidate = await repository.save(candidateData);

    const removed = await repository.remove(candidate.id);

    expect(removed).toBe(true);
    expect(await repository.findAll()).toEqual([]);
  });

  test("debe devolver false al eliminar uno inexistente", async () => {
    expect(await repository.remove(99)).toBe(false);
  });

  test("debe generar IDs sin duplicarlos", async () => {
    const first = await repository.save(candidateData);
    await repository.remove(first.id);

    const second = await repository.save(candidateData);

    expect(second.id).toBe(2);
  });

  test("debe respetar los IDs de candidatos iniciales", async () => {
    const initialRepository = new InMemoryCandidateRepository([
      { id: 5, ...candidateData, skills: [] },
    ]);

    const candidate = await initialRepository.save(candidateData);

    expect(candidate.id).toBe(6);
  });

  // Nueva prueba 1: guardar habilidades.
  test("debe guardar y recuperar las habilidades", async () => {
    const candidate = await repository.save({
      ...candidateData,
      skills: ["TypeScript", "SQL"],
    });

    const result = await repository.findById(candidate.id);

    expect(result?.skills).toEqual(["TypeScript", "SQL"]);
  });

  // Nueva prueba 2: actualizar habilidades.
  test("debe actualizar las habilidades de un candidato", async () => {
    const candidate = await repository.save({
      ...candidateData,
      skills: ["JavaScript"],
    });

    const updated = await repository.update(candidate.id, {
      ...candidateData,
      skills: ["TypeScript", "PostgreSQL"],
    });

    expect(updated?.skills).toEqual(["TypeScript", "PostgreSQL"]);

    const result = await repository.findById(candidate.id);

    expect(result?.skills).toEqual(["TypeScript", "PostgreSQL"]);
  });
  // Verifica el almacenamiento de ciudad y experiencia.
test("debe guardar y recuperar la ciudad y experiencia", async () => {
  const candidate = await repository.save({
    ...candidateData,
    city: "Ambato",
    yearsOfExperience: 0,
  });

  const result = await repository.findById(candidate.id);

  expect(result?.city).toBe("Ambato");
  expect(result?.yearsOfExperience).toBe(0);
});

// Verifica la actualización de ciudad y experiencia.
test("debe actualizar la ciudad y experiencia de un candidato", async () => {
  const candidate = await repository.save(candidateData);

  const updated = await repository.update(candidate.id, {
    ...candidateData,
    city: "Guayaquil",
    yearsOfExperience: 1,
  });

  expect(updated?.city).toBe("Guayaquil");
  expect(updated?.yearsOfExperience).toBe(1);

  const result = await repository.findById(candidate.id);

  expect(result?.city).toBe("Guayaquil");
  expect(result?.yearsOfExperience).toBe(1);
});
});
