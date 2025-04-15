-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "email-change" (
    "token" CHAR(21) NOT NULL,
    "newEmail" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "validUntil" TIMESTAMP(6) NOT NULL DEFAULT (timezone('utc'::text, now()) + '2 days'::interval),

    CONSTRAINT "email-change_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "password-reset" (
    "token" CHAR(21) NOT NULL,
    "userId" UUID NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "validUntil" TIMESTAMP(6) NOT NULL DEFAULT (timezone('utc'::text, now()) + '2 days'::interval),

    CONSTRAINT "password-reset_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "imageUrl" TEXT,
    "registrationDate" TIMESTAMP(6) NOT NULL DEFAULT timezone('UTC'::text, now()),
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email-change_userId_key" ON "email-change"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "password-reset_userId_key" ON "password-reset"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "email-change" ADD CONSTRAINT "email-change_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password-reset" ADD CONSTRAINT "password-reset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
