/*
  Warnings:

  - Added the required column `patient_password` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "patient_password" TEXT NOT NULL;
