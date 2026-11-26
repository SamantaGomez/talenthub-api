-- Crea la tabla de vacantes.
CREATE TABLE IF NOT EXISTS vacancies (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    company VARCHAR(150) NOT NULL,
    modality VARCHAR(30) NOT NULL,
    salary NUMERIC(10, 2) NOT NULL CHECK (salary > 0)
);

-- Crea la tabla de candidatos.
CREATE TABLE IF NOT EXISTS candidates (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    city VARCHAR(150) NOT NULL DEFAULT 'No especificada',
    years_of_experience INTEGER NOT NULL DEFAULT 0
        CHECK (years_of_experience >= 0),
    skills TEXT[] NOT NULL DEFAULT '{}'
);

-- Actualiza una tabla existente sin eliminar sus datos.
ALTER TABLE candidates
ADD COLUMN IF NOT EXISTS skills TEXT[] NOT NULL DEFAULT '{}';

ALTER TABLE candidates
ADD COLUMN IF NOT EXISTS city VARCHAR(150)
NOT NULL DEFAULT 'No especificada';

ALTER TABLE candidates
ADD COLUMN IF NOT EXISTS years_of_experience INTEGER
NOT NULL DEFAULT 0 CHECK (years_of_experience >= 0);