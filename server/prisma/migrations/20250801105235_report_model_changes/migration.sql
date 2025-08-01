/*
  Warnings:

  - You are about to drop the column `reported_target_id` on the `Report` table. All the data in the column will be lost.
  - Changed the type of `reported_target_type` on the `Report` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."ReportTargetType" AS ENUM ('POST', 'COMMENT');

-- AlterTable
ALTER TABLE "public"."Flashcard" ALTER COLUMN "is_public" SET DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Note" ALTER COLUMN "is_public" SET DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Quiz" ALTER COLUMN "is_public" SET DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Report" DROP COLUMN "reported_target_id",
ADD COLUMN     "reported_comment_id" TEXT,
ADD COLUMN     "reported_post_id" TEXT,
DROP COLUMN "reported_target_type",
ADD COLUMN     "reported_target_type" "public"."ReportTargetType" NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Report" ADD CONSTRAINT "Report_reported_post_id_fkey" FOREIGN KEY ("reported_post_id") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Report" ADD CONSTRAINT "Report_reported_comment_id_fkey" FOREIGN KEY ("reported_comment_id") REFERENCES "public"."Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
