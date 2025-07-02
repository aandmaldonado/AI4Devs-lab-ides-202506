/*
  Warnings:

  - You are about to drop the column `cvUrl` on the `Candidato` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Candidato" DROP COLUMN "cvUrl",
ADD COLUMN     "cv" BYTEA;
