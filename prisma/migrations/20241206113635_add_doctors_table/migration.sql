-- CreateTable
CREATE TABLE "doctors" (
    "doctor_id" TEXT NOT NULL,
    "doctor_name" TEXT NOT NULL,
    "doctor_phone" TEXT NOT NULL,
    "doctor_email" TEXT NOT NULL,
    "number_patients" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "years_experience" INTEGER NOT NULL,
    "period_work" TEXT NOT NULL,
    "about" TEXT NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("doctor_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "doctors_doctor_email_key" ON "doctors"("doctor_email");
