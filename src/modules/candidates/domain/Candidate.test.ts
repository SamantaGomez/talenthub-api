
import { parseNewCandidate } from "./Candidate";
import { DomainError } from "../../../shared/DomainError";

describe("Candidate - validación de habilidades", () => {
  const candidateData = {
    name: "Ana Gomez",
    email: "ana@gmail.com",
    phone: "0991234567",
  };

  // Prueba 1: habilidades por defecto.
  test("debe asignar una lista vacía cuando no se envían habilidades", () => {
    const candidate = parseNewCandidate(candidateData);

    expect(candidate.skills).toEqual([]);
  });

  // Prueba 2: lista válida de habilidades.
  test("debe aceptar una lista válida de habilidades", () => {
    const candidate = parseNewCandidate({
      ...candidateData,
      skills: ["TypeScript", "SQL"],
    });

    expect(candidate.skills).toEqual(["TypeScript", "SQL"]);
  });

  // Prueba 3: habilidades inválidas.
  test("debe rechazar habilidades que no sean una lista de textos", () => {
    const invalidSkills = [
      "TypeScript",
      [123, 456],
      ["TypeScript", ""],
      ["SQL", "   "],
      null,
    ];

    invalidSkills.forEach((skills) => {
      expect(() =>
        parseNewCandidate({
          ...candidateData,
          skills,
        })
      ).toThrow(
        new DomainError("Las habilidades deben ser una lista de textos")
      );
    });
  });
});
