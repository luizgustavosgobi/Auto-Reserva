CREATE SCHEMA IF NOT EXISTS "users";

CREATE TABLE IF NOT EXISTS "users"."user" (
  "prontuario" TEXT NOT NULL,
  "email" TEXT,
  "name" TEXT NOT NULL,
  "password" TEXT,
  "accessCode" TEXT NOT NULL,
  "photo" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT false,
  "reciveEmails" BOOLEAN NOT NULL DEFAULT true,
  "funds" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  CONSTRAINT "user_pkey" PRIMARY KEY ("prontuario")
);

CREATE TABLE IF NOT EXISTS "users"."days" (
  "prontuario" TEXT NOT NULL,
  "extraDays" CHAR(10)[],
  "deletedDays" CHAR(10)[],
  "daysOfWeek" TEXT[],
  "reserve" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "days_pkey" PRIMARY KEY ("prontuario")
);

CREATE UNIQUE INDEX IF NOT EXISTS "user_email_key" ON "users"."user"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "user_accessCode_key" ON "users"."user"("accessCode");

ALTER TABLE "users"."days" ADD CONSTRAINT "days_prontuario_fkey" FOREIGN KEY ("prontuario") REFERENCES "users"."user"("prontuario") ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO "users"."user" (prontuario, name, photo, role, "reciveEmails", "accessCode")
VALUES ('0000000', 'Admin', 'https://ibcces.org/wp-content/uploads/2019/03/blank-profile-picture-763x1024.jpg', 'ADMIN', false, 'clzohj9zj000b356bnh0atl53');

INSERT INTO "users"."days" (prontuario, reserve)
VALUES ('0000000', false);