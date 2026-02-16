-- =============================================
-- OPCIONAL: Tabela de sessões em PostgreSQL
-- Só use se preferir sessão no banco. O projeto usa cookie-session
-- (sessão no cookie), então este SQL não é necessário para o login na Vercel.
-- =============================================

CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_pkey') THEN
    ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");

-- RLS desativado: o backend controla o acesso
ALTER TABLE "session" DISABLE ROW LEVEL SECURITY;
