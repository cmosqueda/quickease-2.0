/*
  Warnings:

  - A unique constraint covering the columns `[recipient_id,actor_id,type,resource_id]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Notification_recipient_id_actor_id_type_resource_id_key" ON "public"."Notification"("recipient_id", "actor_id", "type", "resource_id");
