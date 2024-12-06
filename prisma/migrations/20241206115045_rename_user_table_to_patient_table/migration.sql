/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "patients" (
    "patient_id" TEXT NOT NULL,
    "patient_name" TEXT NOT NULL,
    "patient_phone" TEXT NOT NULL,
    "patient_email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("patient_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patients_patient_email_key" ON "patients"("patient_email");
