/*
  Warnings:

  - You are about to drop the `UserActivityLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('COMMENTED', 'REPLIED', 'OBTAINED_BADGE', 'CHANGED_NAME', 'CHANGED_EMAIL', 'CHANGED_PASSWORD', 'REPORTED', 'DELETED_POST_BY_REPORT', 'DELETED_COMMENT_BY_REPORT');

-- DropForeignKey
ALTER TABLE "public"."Report" DROP CONSTRAINT "Report_reported_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Report" DROP CONSTRAINT "Report_reported_post_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserActivityLog" DROP CONSTRAINT "UserActivityLog_actor_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserActivityLog" DROP CONSTRAINT "UserActivityLog_recipient_user_id_fkey";

-- DropTable
DROP TABLE "public"."UserActivityLog";

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "recipient_id" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "resource_id" TEXT,
    "resource_type" TEXT,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_recipient_id_is_read_idx" ON "public"."Notification"("recipient_id", "is_read");

-- AddForeignKey
ALTER TABLE "public"."Report" ADD CONSTRAINT "Report_reported_post_id_fkey" FOREIGN KEY ("reported_post_id") REFERENCES "public"."Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Report" ADD CONSTRAINT "Report_reported_comment_id_fkey" FOREIGN KEY ("reported_comment_id") REFERENCES "public"."Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
