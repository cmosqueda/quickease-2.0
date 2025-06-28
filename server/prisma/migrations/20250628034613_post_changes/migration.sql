/*
  Warnings:

  - You are about to drop the column `quizzes_id` on the `PostAttachment` table. All the data in the column will be lost.
  - You are about to drop the column `time_taken` on the `QuizAttempt` table. All the data in the column will be lost.
  - Changed the type of `resource_type` on the `PostAttachment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('NOTE', 'QUIZ', 'FLASHCARD');

-- DropForeignKey
ALTER TABLE "PostAttachment" DROP CONSTRAINT "PostAttachment_flashcard_id_fkey";

-- DropForeignKey
ALTER TABLE "PostAttachment" DROP CONSTRAINT "PostAttachment_quizzes_id_fkey";

-- AlterTable
ALTER TABLE "PostAttachment" DROP COLUMN "quizzes_id",
ADD COLUMN     "note_id" TEXT,
ADD COLUMN     "quiz_id" TEXT,
DROP COLUMN "resource_type",
ADD COLUMN     "resource_type" "ResourceType" NOT NULL;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "is_randomized" BOOLEAN DEFAULT false,
ADD COLUMN     "timed_quiz" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "QuizAttempt" DROP COLUMN "time_taken";

-- CreateIndex
CREATE INDEX "PostAttachment_resource_type_idx" ON "PostAttachment"("resource_type");

-- AddForeignKey
ALTER TABLE "PostAttachment" ADD CONSTRAINT "PostAttachment_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "Note"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostAttachment" ADD CONSTRAINT "PostAttachment_flashcard_id_fkey" FOREIGN KEY ("flashcard_id") REFERENCES "Flashcard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostAttachment" ADD CONSTRAINT "PostAttachment_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "Quiz"("id") ON DELETE SET NULL ON UPDATE CASCADE;
