-- AlterEnum
ALTER TYPE "public"."TokenType" ADD VALUE 'VERIFY_EMAIL';

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;
