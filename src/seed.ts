import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const doctors = [
    {
      doctorName: 'Dr. João Silva',
      doctorPhone: '(66) 9.9999-9999',
      doctorEmail: 'joao.silva@example.com',
      numberOfPatients: 120,
      rating: 4.8,
      yearsOfExperience: 10,
      periodOfWork: 'Segunda a Sexta, 9h às 18h',
      about: 'Especialista em cardiologia com vasta experiência.',
      avatarUrl: null,
      speciality: 'Cardiologia',
    },
    {
      doctorName: 'Dra. Maria Oliveira',
      doctorPhone: '(66) 9.9999-9988',
      doctorEmail: 'maria.oliveira@example.com',
      numberOfPatients: 80,
      rating: 4.6,
      yearsOfExperience: 8,
      periodOfWork: 'Segunda a Quinta, 10h às 17h',
      about: 'Especialista em dermatologia.',
      avatarUrl: null,
      speciality: 'Dermatologia',
    },
    {
      doctorName: 'Dr. Carlos Mendes',
      doctorPhone: '(66) 9.9999-9977',
      doctorEmail: 'carlos.mendes@example.com',
      numberOfPatients: 150,
      rating: 4.9,
      yearsOfExperience: 12,
      periodOfWork: 'Segunda a Sexta, 8h às 16h',
      about: 'Especialista em ortopedia e traumatologia.',
      avatarUrl: null,
      speciality: 'Ortopedia',
    },
    {
      doctorName: 'Dra. Ana Costa',
      doctorPhone: '(66) 9.9999-9966',
      doctorEmail: 'ana.costa@example.com',
      numberOfPatients: 100,
      rating: 4.7,
      yearsOfExperience: 9,
      periodOfWork: 'Segunda a Quarta, 9h às 15h',
      about: 'Especialista em pediatria com dedicação às crianças.',
      avatarUrl: null,
      speciality: 'Pediatria',
    },
    {
      doctorName: 'Dr. Pedro Albuquerque',
      doctorPhone: '(66) 9.9999-9955',
      doctorEmail: 'pedro.albuquerque@example.com',
      numberOfPatients: 70,
      rating: 4.5,
      yearsOfExperience: 7,
      periodOfWork: 'Terça a Sexta, 10h às 18h',
      about: 'Especialista em neurologia.',
      avatarUrl: null,
      speciality: 'Neurologia',
    },
    {
      doctorName: 'Dra. Beatriz Souza',
      doctorPhone: '(66) 9.9999-9944',
      doctorEmail: 'beatriz.souza@example.com',
      numberOfPatients: 90,
      rating: 4.8,
      yearsOfExperience: 6,
      periodOfWork: 'Segunda a Sexta, 11h às 19h',
      about: 'Especialista em endocrinologia e metabologia.',
      avatarUrl: null,
      speciality: 'Endocrinologia',
    },
  ];

  // Inserindo os médicos no banco de dados
  for (const doctor of doctors) {
    await prisma.doctor.create({
      data: doctor,
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
