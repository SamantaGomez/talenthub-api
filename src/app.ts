import express from 'express';

import { InMemoryVacancyRepository } from './modules/vacancies/adapters/persistence/InMemoryVacancyRepository';
import { VancacyService } from './modules/vacancies/application/VacancyService';
import { createVacancyRouter } from './modules/vacancies/adapters/http/vacancyRoutes';
import { errorHandler, notFoundHandler } from './shared/httpErrorHandlers';
import { PostgresVacancyRepository } from './modules/vacancies/adapters/persistence/PostgresVacancyRepository';
import { VacancyRepository } from './modules/vacancies/ports/VacancyRepository';
import { createPostgresPool } from './shared/database/postgresPool';

import { CandidateRepository } from "./modules/candidates/ports/CandidateRepository";
import { CandidateService } from "./modules/candidates/application/CandidateService";
import { InMemoryCandidateRepository } from "./modules/candidates/adapters/persistence/InMemoryCandidateRepository";
import { PostgresCandidateRepository } from "./modules/candidates/adapters/persistence/PostgresCandidateRepository";
import { createCandidateRouter } from "./modules/candidates/adapters/http/candidateRoutes";


const app = express();

app.use(express.json());

const samplesVacancies = [
    {id: 1, title: 'Desarrollador Backend', company:'Tech Ander', modality: 'remoto', salary: 800},
    {id: 2, title: 'Analista de Datos', company:'DataSur', modality: 'híbrido', salary: 1200},
];

//Repositorio: Guardando las vacantes
const vacancyRepository: VacancyRepository = process.env.DATABASE_URL
    ? new PostgresVacancyRepository(createPostgresPool(process.env.DATABASE_URL))
    : new InMemoryVacancyRepository(samplesVacancies);


//2) Servicio (casos de uso)
const vancacyService = new VancacyService(vacancyRepository);

//3) Rutas: se le entrega el servicio y se monta bajo el prefijo /vacancies
app.use('/vacancies', createVacancyRouter(vancacyService));



 // Selecciona el adaptador de persistencia de Candidates.
const createCandidateRepository = (): CandidateRepository => {
  const adapter = process.env.CANDIDATES_ADAPTER ?? "memory";
  const databaseUrl = process.env.DATABASE_URL;

  if (adapter === "sql" && databaseUrl) {
    console.log("Candidates persistence: PostgreSQL with pg");

    return new PostgresCandidateRepository(
      createPostgresPool(databaseUrl)
    );
  }

  console.log("Candidates persistence: In-memory");

  return new InMemoryCandidateRepository();
};

// Crear el repositorio de candidatos.
const candidateRepository: CandidateRepository =
  createCandidateRepository();


// Servicio de aplicación.
const candidateService = new CandidateService(candidateRepository);

// Registrar las rutas HTTP.
app.use("/candidates", createCandidateRouter(candidateService));


app.use(notFoundHandler);

app.use(errorHandler);

export default app;