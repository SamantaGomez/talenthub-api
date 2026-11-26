import { DomainError } from "../../../shared/DomainError";

// Define la estructura de un candidato.
export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  yearsOfExperience: number;
  skills: string[];
}

// Datos necesarios para registrar un candidato.
export type NewCandidate = Omit<
  Candidate,
  "id" | "skills"
> & {
  skills?: string[];
};

// Tipo de datos validados.
export type CandidateInput = Omit<Candidate, "id">;

// Valida los datos recibidos antes de guardarlos.
export const parseNewCandidate = (
  input: unknown
): CandidateInput => {
  const {
    name,
    email,
    phone,
    city,
    yearsOfExperience,
    skills
  } = (input ?? {}) as Record<string, unknown>;

  // Validar los campos principales.
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

  // Validar el correo electrónico.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.trim())) {
    throw new DomainError(
      "El correo electrónico no es válido"
    );
  }

  // Validar la ciudad.
  if (
    typeof city !== "string" ||
    !city.trim() ||
    city.trim().length > 150
  ) {
    throw new DomainError(
      "La ciudad es obligatoria y debe tener máximo 150 caracteres"
    );
  }

  // Validar los años de experiencia.
  if (
    typeof yearsOfExperience !== "number" ||
    !Number.isInteger(yearsOfExperience) ||
    yearsOfExperience < 0 ||
    yearsOfExperience > 2147483647
  ) {
    throw new DomainError(
      "Los años de experiencia deben ser un número entero mayor o igual a cero"
    );
  }

  // Validar las habilidades.
  if (
    skills !== undefined &&
    (
      !Array.isArray(skills) ||
      !skills.every(
        (skill) =>
          typeof skill === "string" &&
          skill.trim().length > 0
      )
    )
  ) {
    throw new DomainError(
      "Las habilidades deben ser una lista de textos"
    );
  }

  // Devuelve los datos validados.
  return {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    city: city.trim(),
    yearsOfExperience,
    skills: skills === undefined
      ? []
      : (skills as string[]),
  };
};