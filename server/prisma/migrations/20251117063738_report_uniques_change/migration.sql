/*
  Warnings:

  - A unique constraint covering the columns `[reported_by_id,reported_comment_id]` on the table `Report` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Report_reported_by_id_reported_comment_id_key" ON "Report"("reported_by_id", "reported_comment_id");
