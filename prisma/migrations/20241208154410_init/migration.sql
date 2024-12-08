/*
  Warnings:

  - A unique constraint covering the columns `[label,userId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Category_label_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "credits" SET DEFAULT 20;

-- CreateIndex
CREATE UNIQUE INDEX "Category_label_userId_key" ON "Category"("label", "userId");
