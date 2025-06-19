-- AlterTable
ALTER TABLE "Flashcard" ADD COLUMN     "is_ai_generated" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "is_ai_generated" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "is_ai_generated" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "is_admin" BOOLEAN NOT NULL DEFAULT false;
