/*
  Warnings:

  - You are about to drop the column `key` on the `driver_images` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `driver_images` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "driver_images_key_key";

-- AlterTable
ALTER TABLE "driver_images" DROP COLUMN "key",
DROP COLUMN "location";
