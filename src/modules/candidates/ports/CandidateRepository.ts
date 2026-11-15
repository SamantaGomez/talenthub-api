
import { Candidate, NewCandidate } from "../domain/Candidate";

// Contrato que deben cumplir los repositorios de candidatos.
export interface CandidateRepository {

  // Obtener todos los candidatos.
  findAll: () => Promise<Candidate[]>;

  // Buscar un candidato por su ID.
  findById: (id: number) => Promise<Candidate | undefined>;

  // Guardar un candidato nuevo.
  save: (newCandidate: NewCandidate) => Promise<Candidate>;

  // Actualizar un candidato existente.
  update: (
    id: number,
    data: NewCandidate
  ) => Promise<Candidate | undefined>;

  // Eliminar un candidato.
  remove: (id: number) => Promise<boolean>;
}
