
import { DomainError } from "../../../shared/DomainError";

// Define la estructura de un candidato.
export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
}

// Datos necesarios para registrar un candidato.
export type NewCandidate = Omit<Candidate, "id">;

// Valida los datos recibidos antes de guardarlos.
export const parseNewCandidate = (input: unknown): NewCandidate => {
  const { name, email, phone } = (input ?? {}) as Record<string, unknown>;

  // Regla 1: todos los campos son obligatorios.
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

  // Devuelve los datos limpios.
  return {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
  };
};
