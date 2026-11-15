
import { Router } from "express";

import { DomainError } from "../../../../shared/DomainError";
import { HTTP_STATUS } from "../../../../shared/httpStatus";
import { CandidateService } from "../../application/CandidateService";

// Valida que el ID sea un número entero positivo.
const parseId = (value: string): number => {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new DomainError("El identificador no es válido");
  }

  return id;
};

// Crea las rutas HTTP utilizando inyección de dependencias.
export const createCandidateRouter = (
  service: CandidateService
): Router => {
  const router = Router();

  // GET /candidates - Listar candidatos.
  router.get("/", async (req, res) => {
    const candidates = await service.list();

    res.status(HTTP_STATUS.OK).json(candidates);
  });

  // GET /candidates/:id - Buscar candidato.
  router.get("/:id", async (req, res) => {
    const candidate = await service.getById(
      parseId(req.params.id)
    );

    res.status(HTTP_STATUS.OK).json(candidate);
  });

  // POST /candidates - Registrar candidato.
  router.post("/", async (req, res) => {
    const candidate = await service.create(req.body);

    res.status(HTTP_STATUS.CREATED).json(candidate);
  });

  // PUT /candidates/:id - Actualizar candidato.
  router.put("/:id", async (req, res) => {
    const candidate = await service.update(
      parseId(req.params.id),
      req.body
    );

    res.status(HTTP_STATUS.OK).json(candidate);
  });

  // DELETE /candidates/:id - Eliminar candidato.
  router.delete("/:id", async (req, res) => {
    await service.remove(parseId(req.params.id));

    res.status(HTTP_STATUS.NO_CONTENT).send();
  });

  return router;
};
