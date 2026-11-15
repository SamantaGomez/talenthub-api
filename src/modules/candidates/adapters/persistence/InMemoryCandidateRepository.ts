
import { Candidate, NewCandidate } from "../../domain/Candidate";
import { CandidateRepository } from "../../ports/CandidateRepository";

// Adaptador de salida que guarda candidatos en memoria.
export class InMemoryCandidateRepository implements CandidateRepository {
  private candidates: Candidate[];
  private nextId: number;

  constructor(initialCandidates: Candidate[] = []) {
    // Copia los candidatos iniciales.
    this.candidates = initialCandidates.map((candidate) => ({
      ...candidate,
    }));

    // Evita repetir identificadores existentes.
    this.nextId =
      Math.max(0, ...initialCandidates.map((candidate) => candidate.id)) + 1;
  }

  // Caso 1: listar todos los candidatos.
  findAll = async (): Promise<Candidate[]> => {
    return this.candidates.map((candidate) => ({ ...candidate }));
  };

  // Caso 2: buscar un candidato por ID.
  findById = async (id: number): Promise<Candidate | undefined> => {
    const candidate = this.candidates.find((item) => item.id === id);

    return candidate ? { ...candidate } : undefined;
  };

  // Caso 3: guardar un candidato nuevo.
  save = async (newCandidate: NewCandidate): Promise<Candidate> => {
    const candidate: Candidate = {
      id: this.nextId++,
      ...newCandidate,
    };

    this.candidates.push(candidate);

    return { ...candidate };
  };

  // Caso 4: actualizar un candidato.
  update = async (
    id: number,
    data: NewCandidate
  ): Promise<Candidate | undefined> => {
    const index = this.candidates.findIndex((item) => item.id === id);

    if (index === -1) {
      return undefined;
    }

    const updated: Candidate = {
      id,
      ...data,
    };

    this.candidates[index] = updated;

    return { ...updated };
  };

  // Caso 5: eliminar un candidato.
  remove = async (id: number): Promise<boolean> => {
    const index = this.candidates.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    this.candidates.splice(index, 1);

    return true;
  };
}
