DROP TABLE IF EXISTS "public"."admin_types";
-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Squences
CREATE SEQUENCE IF NOT EXISTS admin_types_id_seq

-- Table Definition
CREATE TABLE "public"."admin_types" (
    "id" int4 NOT NULL DEFAULT nextval('admin_types_id_seq'::regclass),
    "name" varchar NOT NULL,
    "description" text,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."users";
-- This script only contains the table creation statements and does not fully represent the table in database. It's still missing: indices, triggers. Do not use it as backup.

-- Squences
CREATE SEQUENCE IF NOT EXISTS untitled_table_204_id_seq

-- Table Definition
CREATE TABLE "public"."users" (
    "id" int8 NOT NULL DEFAULT nextval('untitled_table_204_id_seq'::regclass),
    "email" varchar NOT NULL,
    "name" varchar NOT NULL,
    "created_at" timestamp DEFAULT now(),
    "email_verified_at" timestamp,
    "password" varchar,
    "is_admin" bool NOT NULL DEFAULT false,
    "avatar" varchar,
    "is_active" bool NOT NULL DEFAULT true,
    "admin_type" int8,
    "refresh_token" text,
    "verification_token" text,
    CONSTRAINT "users_admin_type_fkey" FOREIGN KEY ("admin_type") REFERENCES "public"."admin_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    PRIMARY KEY ("id")
);

INSERT INTO "public"."admin_types" ("id", "name", "description") VALUES
(1, 'Super Admin', 'Can do anything');
INSERT INTO "public"."admin_types" ("id", "name", "description") VALUES
(2, 'Editor', 'low level that super admin');
