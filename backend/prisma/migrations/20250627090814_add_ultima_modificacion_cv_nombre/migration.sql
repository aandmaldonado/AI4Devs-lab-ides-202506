/*
  Warnings:

  - Added the required column `ultimaModificacion` to the `Candidato` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Candidato" ADD COLUMN     "cvNombre" VARCHAR(200),
ADD COLUMN     "ultimaModificacion" TIMESTAMP(3) NOT NULL;
