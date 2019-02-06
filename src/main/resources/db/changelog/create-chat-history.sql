--liquibase formatted sql

-- changeset sosen:create-chat_history
CREATE TABLE chat_history
(
  id        SERIAL PRIMARY KEY     NOT NULL,
  date      CHARACTER VARYING(32)  NOT NULL,
  user_name CHARACTER VARYING(256) NOT NULL,
  content   CHARACTER VARYING(1024)
);

COMMENT ON TABLE chat_history
IS 'Historia chatu';
COMMENT ON COLUMN chat_history.id
IS 'Id wiadomości';
COMMENT ON COLUMN chat_history.date
IS 'Data wiadomości';
COMMENT ON COLUMN chat_history.user_name
IS 'Nazwa użytkownika';
COMMENT ON COLUMN chat_history.content
IS 'Treść wiadomości';
-- rollback DROP TABLE chat_history;
