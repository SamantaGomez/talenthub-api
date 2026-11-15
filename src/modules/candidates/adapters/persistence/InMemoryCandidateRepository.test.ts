
import { InMemoryCandidateRepository } from "./InMemoryCandidateRepository";

describe("InMemoryCandidateRepository", () => {
  let repository: InMemoryCandidateRepository;

  const candidateData = {
    name: "Ana Gomez",
    email: "ana@gmail.com",
    phone: "0991234567",
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
    });
  });

  test("debe listar los candidatos registrados", async () => {
    await repository.save(candidateData);

    const result = await repository.findAll();

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Ana Gomez");
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
      name: "Ana Robles",
      email: "ana.robles@gmail.com",
      phone: "0987654321",
    });

    expect(updated).toEqual({
      id: 1,
      name: "Ana Robles",
      email: "ana.robles@gmail.com",
      phone: "0987654321",
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
      { id: 5, ...candidateData },
    ]);

    const candidate = await initialRepository.save(candidateData);

    expect(candidate.id).toBe(6);
  });
});

