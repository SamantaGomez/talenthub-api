
import { DomainError } from "../../../shared/DomainError";

// Define la estructura de un candidato.
export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  skills: string[];
}

// Datos necesarios para registrar un candidato.
// skills es opcional en la entrada, pero obligatorio en Candidate.
export type NewCandidate = Omit<Candidate, "id" | "skills"> & {
  skills?: string[];
};

// Valida los datos recibidos antes de guardarlos.
export const parseNewCandidate = (input: unknown): CandidateInput => {
  const { name, email, phone, skills } = (input ?? {}) as Record<
    string,
    unknown
  >;

  // Regla 1: todos los campos principales son obligatorios.
  if (
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim() ||
    typeof phone !== "string" ||
    !phone.trim()
  ) {
    throw new DomainError(
      "El nombre, correo electrónico y teléfono son obligatorios"
    );
  }

  // Regla 2: validar el formato del correo electrónico.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.trim())) {
    throw new DomainError("El correo electrónico no es válido");
  }

  // Regla 3: validar las habilidades.
  if (
    skills !== undefined &&
    (!Array.isArray(skills) ||
      !skills.every(
        (skill) => typeof skill === "string" && skill.trim().length > 0
      ))
  ) {
    throw new DomainError("Las habilidades deben ser una lista de textos");
  }

  // Devuelve los datos limpios.
  return {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    skills: skills === undefined ? [] : (skills as string[]),
  };
};

// Tipo de datos validados con skills siempre presente.
export type CandidateInput = Omit<Candidate, "id">;
