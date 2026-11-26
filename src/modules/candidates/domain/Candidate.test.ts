import { parseNewCandidate } from "./Candidate";
import { DomainError } from "../../../shared/DomainError";

describe("Candidate - validación de datos", () => {
  const candidateData = {
    name: "Ana Gomez",
    email: "ana@gmail.com",
    phone: "0991234567",
    city: "Quito",
    yearsOfExperience: 3,
  };

  // Prueba 1: habilidades por defecto.
  test("debe asignar una lista vacía cuando no se envían habilidades", () => {
    const candidate = parseNewCandidate(candidateData);

    expect(candidate.skills).toEqual([]);
  });

  // Prueba 2: habilidades válidas.
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

  // Prueba 4: ciudad válida.
  test("debe aceptar una ciudad válida", () => {
    const candidate = parseNewCandidate(candidateData);

    expect(candidate.city).toBe("Quito");
  });

  // Prueba 5: ciudad inválida.
  test("debe rechazar una ciudad inválida", () => {
    const invalidCities = ["", "   ", 123, null, undefined];

    invalidCities.forEach((city) => {
      expect(() =>
        parseNewCandidate({
          ...candidateData,
          city,
        })
      ).toThrow(DomainError);
    });
  });

  // Prueba 6: candidato sin experiencia.
  test("debe aceptar cero años de experiencia", () => {
    const candidate = parseNewCandidate({
      ...candidateData,
      yearsOfExperience: 0,
    });

    expect(candidate.yearsOfExperience).toBe(0);
  });

  // Prueba 7: candidato con un año de experiencia.
  test("debe aceptar un año de experiencia", () => {
    const candidate = parseNewCandidate({
      ...candidateData,
      yearsOfExperience: 1,
    });

    expect(candidate.yearsOfExperience).toBe(1);
  });

  // Prueba 8: experiencia inválida.
  test("debe rechazar años de experiencia inválidos", () => {
    const invalidExperience = [
      -1,
      1.5,
      "3",
      null,
      undefined,
      NaN,
    ];

    invalidExperience.forEach((yearsOfExperience) => {
      expect(() =>
        parseNewCandidate({
          ...candidateData,
          yearsOfExperience,
        })
      ).toThrow(DomainError);
    });
  });
});