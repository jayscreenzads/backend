/*
  Warnings:

  - Added the required column `stripeProductId` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "customers_stripeCustomerId_key";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "stripeProductId" TEXT NOT NULL;
