/*
  Warnings:

  - You are about to drop the column `isApproved` on the `drivers` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DriverStatus" AS ENUM ('VERIFICATION_PENDING', 'APPROVED', 'DECLINED', 'CANCELLED');

-- AlterTable
ALTER TABLE "drivers" DROP COLUMN "isApproved",
ADD COLUMN     "dateDeclined" TEXT,
ADD COLUMN     "status" "DriverStatus" NOT NULL DEFAULT 'VERIFICATION_PENDING';
