
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
      skills: [...(candidate.skills ?? [])],
    }));

    // Evita repetir identificadores existentes.
    this.nextId =
      Math.max(0, ...initialCandidates.map((candidate) => candidate.id)) + 1;
  }

  // Caso 1: listar todos los candidatos.
  findAll = async (): Promise<Candidate[]> => {
    return this.candidates.map((candidate) => ({
      ...candidate,
      skills: [...candidate.skills],
    }));
  };

  // Caso 2: buscar un candidato por ID.
  findById = async (id: number): Promise<Candidate | undefined> => {
    const candidate = this.candidates.find((item) => item.id === id);

    return candidate
      ? { ...candidate, skills: [...candidate.skills] }
      : undefined;
  };

  // Caso 3: guardar un candidato nuevo.
  save = async (newCandidate: NewCandidate): Promise<Candidate> => {
    const candidate: Candidate = {
      ...newCandidate,
      id: this.nextId++,
      skills: [...(newCandidate.skills ?? [])],
    };

    this.candidates.push(candidate);

    return { ...candidate, skills: [...candidate.skills] };
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
      ...data,
      id,
      skills: [...(data.skills ?? [])],
    };

    this.candidates[index] = updated;

    return { ...updated, skills: [...updated.skills] };
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
