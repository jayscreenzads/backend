/*
  Warnings:

  - A unique constraint covering the columns `[driverId]` on the table `driver_images` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "driver_images_driverId_key" ON "driver_images"("driverId");
