
import { CandidateService } from "./CandidateService";
import { CandidateRepository } from "../ports/CandidateRepository";
import { Candidate } from "../domain/Candidate";
import { DomainError } from "../../../shared/DomainError";
import { NotFoundError } from "../../../shared/NotFoundError";

describe("CandidateService", () => {
  let repository: jest.Mocked<CandidateRepository>;
  let service: CandidateService;

  const candidate: Candidate = {
    id: 1,
    name: "Ana Gomez",
    email: "ana@gmail.com",
    phone: "0991234567",
    skills: [],
  };

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    service = new CandidateService(repository);
  });

  test("debe listar todos los candidatos", async () => {
    repository.findAll.mockResolvedValue([candidate]);

    const result = await service.list();

    expect(result).toEqual([candidate]);
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });

  test("debe buscar un candidato por ID", async () => {
    repository.findById.mockResolvedValue(candidate);

    const result = await service.getById(1);

    expect(result).toEqual(candidate);
    expect(repository.findById).toHaveBeenCalledWith(1);
  });

  test("debe lanzar error si el candidato no existe", async () => {
    repository.findById.mockResolvedValue(undefined);

    await expect(service.getById(99)).rejects.toThrow(NotFoundError);
  });

  test("debe crear un candidato válido", async () => {
    repository.save.mockResolvedValue(candidate);

    const result = await service.create({
      name: "Ana Gomez",
      email: "ana@gmail.com",
      phone: "0991234567",
      skills: [],
    });

    expect(result).toEqual(candidate);
    expect(repository.save).toHaveBeenCalledWith({
      name: "Ana Gomez",
      email: "ana@gmail.com",
      phone: "0991234567",
      skills: [],
    });
  });

  test("debe rechazar un correo inválido", async () => {
    await expect(
      service.create({
        name: "Ana Gomez",
        email: "correo-invalido",
        phone: "0991234567",
        skills: [],
      })
    ).rejects.toThrow(DomainError);

    expect(repository.save).not.toHaveBeenCalled();
  });

  test("debe actualizar un candidato", async () => {
    repository.update.mockResolvedValue(candidate);

    const result = await service.update(1, {
      name: "Ana Gomez",
      email: "ana@gmail.com",
      phone: "0991234567",
      skills: [],
    });

    expect(result).toEqual(candidate);
    expect(repository.update).toHaveBeenCalledWith(1, {
      name: "Ana Gomez",
      email: "ana@gmail.com",
      phone: "0991234567",
      skills: [],
    });
  });

  test("debe lanzar error al actualizar un candidato inexistente", async () => {
    repository.update.mockResolvedValue(undefined);

    await expect(
      service.update(99, {
        name: "Ana Gomez",
        email: "ana@gmail.com",
        phone: "0991234567",
      })
    ).rejects.toThrow(NotFoundError);
  });

  test("debe eliminar un candidato", async () => {
    repository.remove.mockResolvedValue(true);

    await expect(service.remove(1)).resolves.toBeUndefined();
    expect(repository.remove).toHaveBeenCalledWith(1);
  });

  test("debe lanzar error al eliminar un candidato inexistente", async () => {
    repository.remove.mockResolvedValue(false);

    await expect(service.remove(99)).rejects.toThrow(NotFoundError);
  });
});
