/*
  Warnings:

  - The primary key for the `Candidato` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Candidato` table. All the data in the column will be lost.
  - Added the required column `documento` to the `Candidato` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Candidato" DROP CONSTRAINT "Candidato_pkey",
DROP COLUMN "id",
ADD COLUMN     "documento" VARCHAR(20) NOT NULL,
ADD CONSTRAINT "Candidato_pkey" PRIMARY KEY ("documento");
