/*
  Warnings:

  - Added the required column `default_price` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripePriceId` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "default_price" DECIMAL(9,2) NOT NULL,
ADD COLUMN     "stripePriceId" TEXT NOT NULL;
