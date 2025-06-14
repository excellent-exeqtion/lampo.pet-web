-- 1) Habilitar extensión para UUID si no está
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2) Tabla de dueños
CREATE TABLE owners (
  owner_id UUID PRIMARY KEY,
  name        TEXT    NOT NULL,
  phone       TEXT    NOT NULL,
  address     TEXT    NOT NULL,
  city        TEXT    NOT NULL,
  country     TEXT    NOT NULL,
  email       TEXT    NOT NULL UNIQUE
);

-- 3) Tabla de datos básicos de la mascota
CREATE TABLE basic_data (
  pet_id              TEXT      PRIMARY KEY REFERENCES pets(id) ON DELETE CASCADE,
  pet_type            TEXT      NOT NULL,
  gender              TEXT      NOT NULL,
  weight              TEXT      NOT NULL,
  race                TEXT      NOT NULL,
  coat_type           TEXT      NOT NULL,
  color               TEXT      NOT NULL,
  has_allergies       BOOLEAN   NOT NULL,
  weight_condition    TEXT      NOT NULL,
  size                TEXT      NOT NULL,
  lives_with_others   BOOLEAN   NOT NULL,
  main_food           TEXT      NOT NULL,
  has_vaccine         BOOLEAN   NOT NULL,
  last_vaccine_name   TEXT,
  last_vaccine_date   TIMESTAMP,
  is_sterilized       BOOLEAN   NOT NULL,
  sterilization_date  TIMESTAMP,
  has_anti_flea       BOOLEAN   NOT NULL,
  anti_flea_date      TIMESTAMP,
  uses_medicine       BOOLEAN   NOT NULL,
  special_condition   BOOLEAN   NOT NULL
);

-- 4) Vacunas
CREATE TABLE vaccines (
  id          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id      TEXT      REFERENCES pets(id) ON DELETE CASCADE,
  name        TEXT      NOT NULL,
  description TEXT,
  date        TIMESTAMP,
  batch       TEXT      NOT NULL,
  brand       TEXT      NOT NULL
);

-- 5) Cirugías
CREATE TABLE surgeries (
  id          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id      TEXT      REFERENCES pets(id) ON DELETE CASCADE,
  name        TEXT      NOT NULL,
  date        TIMESTAMP,
  description TEXT
);

-- 6) Medicinas
CREATE TABLE medicines (
  id        UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id    TEXT    REFERENCES pets(id) ON DELETE CASCADE,
  name      TEXT    NOT NULL,
  dosage    TEXT    NOT NULL,
  frequency TEXT    NOT NULL
);

-- 7) Condiciones especiales
CREATE TABLE conditions (
  id        UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id    TEXT    REFERENCES pets(id) ON DELETE CASCADE,
  condition TEXT    NOT NULL,
  severity  TEXT    NOT NULL
);

-- 8) Exámenes de laboratorio
CREATE TABLE lab_tests (
  id     UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id TEXT      REFERENCES pets(id) ON DELETE CASCADE,
  name   TEXT      NOT NULL,
  type   TEXT      NOT NULL,
  date   TIMESTAMP,
  result TEXT
);


-- Owners
INSERT INTO owners(owner_id, name, phone, address, city, country, email) VALUES
  ('8933eed8-daea-4e6c-b4db-44906b9f44f9','Andrés Aulestia','+57 3146061490','Cra. 74 #152b-70 Torre 3 Apto. 1704','Bogotá','Colombia','a.aulestia@exe.com.co'),
  ('41095adf-27a6-48f8-ada1-d8c7d3dd265a','Johnnatan Ruiz','+57 3112849616','Calle 82 #19A-29 Apt 401','Bogotá','Colombia','excellent.exeqtion@gmail.com');

-- Basic data
INSERT INTO basic_data(
  pet_id, pet_type, gender, weight, race, has_allergies,
  weight_condition, size, lives_with_others, main_food,
  has_vaccine, last_vaccine_name, last_vaccine_date,
  is_castrated, castration_date, has_anti_flea, anti_flea_date,
  uses_medicine, special_condition
) VALUES
  (
    'A001','Gato','Macho','5.5 Kg','Mestizo',false,
    'Normal','Mediano',false,'Taste the Wild',
    true,'Parvigen','2024-07-25',
    true,'2023-12-02',true,'2023-12-15',
    false,false
  ),
  (
    'A002','Perro','Macho','7 Kg','Criollo',false,
    'Normal','Mediano',true,'Pro Plan',
    false,NULL,NULL,
    true,'2023-06-30',false,NULL,
    false,false
  ),
  (
    'A003','Perro','Macho','9 Kg','Criollo',true,
    'Normal','Mediano',true,'Vet Life',
    false,NULL,NULL,
    true,'2019-05-03',false,NULL,
    false,true
  );

-- Vacunas
INSERT INTO vaccines(pet_id, name, description, date, batch, brand) VALUES
  ('A001','Rabia','Vacuna contra la rabia','2025-03-15','RAB12345','Nobivac'),
  ('A001','Parvovirus','Prevención de parvovirus','2025-02-10','PARV67890','Canigen'),
  ('A002','Parvovirus','Prevención de parvovirus','2025-02-10','PARV67890','Canigen');

-- Cirugías
INSERT INTO surgeries(pet_id, name, date, description) VALUES
  ('A001','Castración','2024-11-20','Castración preventiva'),
  ('A001','Extracción dental','2024-12-05','Tooth extraction'),
  ('A002','Castración','2023-06-30','Castración preventiva'),
  ('A003','Castración','2019-05-03','Castración preventiva');

-- Medicinas
INSERT INTO medicines(pet_id, name, dosage, frequency) VALUES
  ('A001','Antibiótico X','250mg','Cada 12 horas'),
  ('A001','Vitamina C','100mg','Diaria');

-- Condiciones especiales
INSERT INTO conditions(pet_id, condition, severity) VALUES
  ('A001','Esterilidad aórtica','Moderada'),
  ('A001','Alergia alimentaria','Leve'),
  ('A003','Insuficiencia renal','Leve');

-- Exámenes de laboratorio
INSERT INTO lab_tests(pet_id, name, type, date, result) VALUES
  ('A001','Hemograma completo','Blood','2025-01-10','Normal'),
  ('A001','Ultrasonido abdominal','Ultrasound','2024-12-22','Sin hallazgos');
