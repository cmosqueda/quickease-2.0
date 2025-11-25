-- AlterTable
ALTER TABLE "Flashcard" ADD COLUMN     "connected_note_id" TEXT;

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "has_pregenerated_contents" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "connected_note_id" TEXT;

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_connected_note_id_fkey" FOREIGN KEY ("connected_note_id") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_connected_note_id_fkey" FOREIGN KEY ("connected_note_id") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
