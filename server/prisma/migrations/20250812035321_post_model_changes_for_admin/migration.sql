-- CreateEnum
CREATE TYPE "public"."ResolveType" AS ENUM ('IS_DELETED', 'IS_HIDDEN', 'NULL');

-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "is_resolved" "public"."ResolveType";
