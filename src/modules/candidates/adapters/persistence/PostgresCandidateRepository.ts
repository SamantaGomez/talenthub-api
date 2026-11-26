import type { Pool } from "pg";

import type { Candidate, NewCandidate } from "../../domain/Candidate";
import type { CandidateRepository } from "../../ports/CandidateRepository";

// Representa una fila recibida desde PostgreSQL.
type CandidateRow = {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  years_of_experience: number;
  skills: string[];
};

// Columnas utilizadas en las consultas.
const COLUMNS =
  "id, name, email, phone, city, years_of_experience, skills";

// Convierte una fila de PostgreSQL en un candidato.
const toCandidate = (row: CandidateRow): Candidate => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  city: row.city,
  yearsOfExperience: row.years_of_experience,
  skills: row.skills,
});

// Adaptador de persistencia PostgreSQL.
export class PostgresCandidateRepository
  implements CandidateRepository {
  constructor(private readonly pool: Pool) {}

  // Caso 1: listar todos los candidatos.
  findAll = async (): Promise<Candidate[]> => {
    const result = await this.pool.query<CandidateRow>(
      `SELECT ${COLUMNS} FROM candidates ORDER BY id`
    );

    return result.rows.map(toCandidate);
  };

  // Caso 2: buscar un candidato por ID.
  findById = async (
    id: number
  ): Promise<Candidate | undefined> => {
    const result = await this.pool.query<CandidateRow>(
      `SELECT ${COLUMNS} FROM candidates WHERE id = $1`,
      [id]
    );

    return result.rows[0]
      ? toCandidate(result.rows[0])
      : undefined;
  };

  // Caso 3: guardar un candidato.
  save = async (
    newCandidate: NewCandidate
  ): Promise<Candidate> => {
    const result = await this.pool.query<CandidateRow>(
      `INSERT INTO candidates
       (name, email, phone, city, years_of_experience, skills)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING ${COLUMNS}`,
      [
        newCandidate.name,
        newCandidate.email,
        newCandidate.phone,
        newCandidate.city,
        newCandidate.yearsOfExperience,
        newCandidate.skills ?? [],
      ]
    );

    return toCandidate(result.rows[0]);
  };

  // Caso 4: actualizar un candidato.
  update = async (
    id: number,
    data: NewCandidate
  ): Promise<Candidate | undefined> => {
    const result = await this.pool.query<CandidateRow>(
      `UPDATE candidates
       SET name = $1,
           email = $2,
           phone = $3,
           city = $4,
           years_of_experience = $5,
           skills = $6
       WHERE id = $7
       RETURNING ${COLUMNS}`,
      [
        data.name,
        data.email,
        data.phone,
        data.city,
        data.yearsOfExperience,
        data.skills ?? [],
        id,
      ]
    );

    return result.rows[0]
      ? toCandidate(result.rows[0])
      : undefined;
  };

  // Caso 5: eliminar un candidato.
  remove = async (id: number): Promise<boolean> => {
    const result = await this.pool.query(
      `DELETE FROM candidates WHERE id = $1`,
      [id]
    );

    return (result.rowCount ?? 0) > 0;
  };
}