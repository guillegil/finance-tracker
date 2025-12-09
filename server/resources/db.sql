-- 0. Extensions (Required for UUID generation in some Postgres versions)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255),
    "surname" VARCHAR(255),
    "pass_hash" VARCHAR(255) NOT NULL,
    "birthday" DATE,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "username" VARCHAR(255) NOT NULL UNIQUE,
    "avatar" VARCHAR,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "categories" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "avatar" VARCHAR,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "currencies" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "symbol" VARCHAR(10) NOT NULL,
    "code" VARCHAR(4) NOT NULL UNIQUE,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "recurrent_type" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "accounts" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "iban" VARCHAR(255) UNIQUE, 
    "is_main" BOOLEAN DEFAULT FALSE,
    "user_id" UUID NOT NULL,
    "currency_id" UUID NOT NULL, -- NEW: Mandatory Link
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "recurrents" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "amount" DECIMAL(12, 2) NOT NULL,
    "description" TEXT,
    "logo" VARCHAR(255),
    "is_automatic" BOOLEAN DEFAULT FALSE,
    "frequency" VARCHAR(50) NOT NULL,
    "interval" INTEGER DEFAULT 1,
    "start_date" DATE NOT NULL,
    "next_run_date" DATE NOT NULL,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW(),
    "recurrent_type_id" UUID NOT NULL,
    "account_id" UUID,
    "category_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "currency_id" UUID NOT NULL
);

CREATE TABLE IF NOT EXISTS "transactions" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(12, 2) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "date" TIMESTAMP DEFAULT NOW(), -- NEW: The Transaction Date
    "created_at" TIMESTAMP DEFAULT NOW(), -- System Audit Timestamp
    "updated_at" TIMESTAMP DEFAULT NOW(),
    "user_id" UUID NOT NULL,
    "currency_id" UUID NOT NULL,
    "category_id" UUID,
    "account_id" UUID NOT NULL,
    "dest_account_id" UUID
);

-- ------------------
-- Relationships
-- ------------------

-- Accounts
ALTER TABLE "accounts" 
ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "accounts" 
ADD FOREIGN KEY ("currency_id") REFERENCES "currencies"("id"); -- NEW

-- Recurrents
ALTER TABLE "recurrents" 
ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "recurrents" 
ADD FOREIGN KEY ("category_id") REFERENCES "categories"("id");
ALTER TABLE "recurrents" 
ADD FOREIGN KEY ("currency_id") REFERENCES "currencies"("id");
ALTER TABLE "recurrents" 
ADD FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE SET NULL;
ALTER TABLE "recurrents" 
ADD FOREIGN KEY ("recurrent_type_id") REFERENCES "recurrent_type"("id");

-- Transactions
ALTER TABLE "transactions" 
ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "transactions" 
ADD FOREIGN KEY ("currency_id") REFERENCES "currencies"("id");
ALTER TABLE "transactions" 
ADD FOREIGN KEY ("category_id") REFERENCES "categories"("id");
ALTER TABLE "transactions" 
ADD FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE;
ALTER TABLE "transactions" 
ADD FOREIGN KEY ("dest_account_id") REFERENCES "accounts"("id") ON DELETE SET NULL;

-- ------------------
-- Constraints
-- ------------------

-- Ensure amount is positive
ALTER TABLE "transactions"
ADD CONSTRAINT "check_amount_positive" 
CHECK ("amount" > 0);

-- Ensure no self transfer
ALTER TABLE "transactions"
ADD CONSTRAINT "check_no_self_transfer" 
CHECK ("account_id" != "dest_account_id");

-- Ensure transfers has destination
ALTER TABLE "transactions"
ADD CONSTRAINT "check_transfer_has_destination" 
CHECK (
    ("type" != 'TRANSFER') OR ("dest_account_id" IS NOT NULL)
);

-- Ensure interval is positive
ALTER TABLE "recurrents"
ADD CONSTRAINT "check_interval_positive" 
CHECK ("interval" >= 1);

-- Sanity Check
ALTER TABLE "users"
ADD CONSTRAINT "check_email_has_at" 
CHECK (position('@' in "email") > 0);

-- ------------------
-- Indexes
-- ------------------

CREATE INDEX "idx_transactions_user_date" 
ON "transactions" ("user_id", "date" DESC); -- Updated to sort by 'date'

CREATE INDEX "idx_transactions_account" 
ON "transactions" ("account_id");

CREATE INDEX "idx_recurrents_process_queue" 
ON "recurrents" ("next_run_date") 
WHERE "is_automatic" = TRUE;