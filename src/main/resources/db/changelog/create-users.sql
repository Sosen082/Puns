--liquibase formatted sql

-- changeset tkurek:create_users
CREATE TABLE users
(
  id          SERIAL PRIMARY KEY     NOT NULL,
  user_name   CHARACTER VARYING(255) NOT NULL,
  password    CHARACTER VARYING(255) NOT NULL,
  first_name  CHARACTER VARYING(255),
  last_name   CHARACTER VARYING(255),
  email       CHARACTER VARYING(255) NOT NULL,
  language_id INTEGER                NOT NULL REFERENCES languages (id)
);

COMMENT ON TABLE users
IS 'Użytkownicy';
COMMENT ON COLUMN users.id
IS 'Id użytkownika';
COMMENT ON COLUMN users.user_name
IS 'Nazwa użytkownika';
COMMENT ON COLUMN users.password
IS 'Hasło użytkownika';
COMMENT ON COLUMN users.first_name
IS 'Imię użytkownika';
COMMENT ON COLUMN users.last_name
IS 'Nazwisko użytkownika';
COMMENT ON COLUMN users.email
IS 'Email użytkownika';
COMMENT ON COLUMN users.language_id
IS 'Domyślny język aplikacji';
-- rollback DROP TABLE users;

-- changeset tkurek:create_users_h
CREATE TABLE users_h
(
  id          SERIAL PRIMARY KEY     NOT NULL,
  op_type     VARCHAR(30)            NOT NULL,
  op_ts       TIMESTAMP              NOT NULL,
  src_id      BIGINT                 NOT NULL,
  user_name   CHARACTER VARYING(255) NOT NULL,
  password    CHARACTER VARYING(255) NOT NULL,
  first_name  CHARACTER VARYING(255) NOT NULL,
  last_name   CHARACTER VARYING(255) NOT NULL,
  email       CHARACTER VARYING(255) NOT NULL,
  language_id INTEGER                NOT NULL REFERENCES languages (id)
);

COMMENT ON TABLE users_h
IS 'Tabela historyczna dla users';
COMMENT ON COLUMN users_h.id
IS 'Klucz główny tabeli historycznej dla users';
COMMENT ON COLUMN users_h.op_type
IS 'Rodzaj operacji';
COMMENT ON COLUMN users_h.op_ts
IS 'Czas wykonania zmiany';
COMMENT ON COLUMN users_h.src_id
IS 'Klucz glowny z tabeli users';
COMMENT ON COLUMN users_h.user_name
IS 'Nazwa użytkownika';
COMMENT ON COLUMN users_h.password
IS 'Hasło użytkownika';
COMMENT ON COLUMN users_h.first_name
IS 'Imię użytkownika';
COMMENT ON COLUMN users_h.last_name
IS 'Nazwisko użytkownika';
COMMENT ON COLUMN users_h.email
IS 'Email użytkownika';
COMMENT ON COLUMN users_h.language_id
IS 'Domyślny język aplikacji';
-- rollback DROP TABLE users_h;

-- changeset tkurek:create_users-lower-idx
CREATE INDEX user_name_lower_idx
  ON users (lower(user_name));
CREATE INDEX password_idx
  ON users (password);
-- rollback DROP INDEX password_idx;
-- rollback DROP INDEX user_name_lower_idx;

-- changeset tkurek:create_users-first_init_data
INSERT INTO users (user_name, password, first_name, last_name, email, language_id)
VALUES
  ('admin', '$2a$05$q.q5I0vWvQvJK2p/kzLspOVsvbripvmqQugKC98BL.BWPUlrlWjBi', 'Tomasz', 'Kurek', 'tkurek@pretius.com',
   (SELECT id
    FROM languages
    WHERE name = 'en'));
INSERT INTO users (user_name, password, first_name, last_name, email, language_id)
VALUES
  ('user1', '$2a$06$x9nHKO.3dnECJKHrcSElB.R1A2U0OTiFDHN5AWJdpKP5FKiOZQQye', 'Tomasz', 'Kurek', 'tkurek@pretius.com',
   (SELECT id
    FROM languages
    WHERE name = 'pl'));
-- rollback DELETE FROM users;

-- changeset tkurek:create_users-new_column-photo
ALTER TABLE users
  ADD COLUMN photo_id INTEGER;
ALTER TABLE users_h
  ADD COLUMN photo_id INTEGER;
-- rollback ALTER TABLE users DROP COLUMN photo_id;
-- rollback ALTER TABLE users_h DROP COLUMN photo_id;

-- changeset tkurek:create_users-new_column-photo-constraint
ALTER TABLE users
  ADD CONSTRAINT FK_FILE_ID FOREIGN KEY (photo_id) REFERENCES files (id);
-- rollback ALTER TABLE users DROP CONSTRAINT FK_FILE_ID;
