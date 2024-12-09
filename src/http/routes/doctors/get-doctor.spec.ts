import { buildApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { beforeEach, describe, expect, it } from "vitest";
import request from 'supertest'
import { FastifyInstance } from "fastify";

describe("Busca médico específico", () => {
  let app: FastifyInstance

  beforeEach(async () => {
    app = buildApp()
    await app.ready()

    await prisma.doctor.deleteMany()
  })

  it("paciente deve ser capaz de buscar um médico específico", async () => {
    // cria usuário paciente
    const response = await request(app.server)
      .post('/patients')
      .send({
        patientName: "John Doe",
        patientEmail: "johndoe@teste.com",
        patientPhone: "(66) 9.8877-8877",
        patientPassword: "john123!@#",
      });

    expect(response.status).toBe(201);

    // tenta logar
    const loginResponse = await request(app.server)
      .post('/patients/sessions/password')
      .send({
        email: 'johndoe@teste.com',
        password: 'john123!@#'
      })

    expect(loginResponse.status).toBe(201)
    expect(loginResponse.body).toHaveProperty('token')
    expect(typeof loginResponse.body.token).toBe('string')

    // extração e validação do token do usuário
    const { token } = loginResponse.body
    expect(token).toBeDefined()
    expect(typeof token).toBe('string')

    // cria médico
    await prisma.doctor.create({
      data: {
        doctorName: 'Dra. Joana Souza',
        doctorPhone: '(66) 9.9999-9944',
        doctorEmail: 'joana.souza@example.com',
        numberOfPatients: 90,
        rating: 5.0,
        yearsOfExperience: 3,
        periodOfWork: 'Segunda a Sexta, 11h às 19h',
        about: 'Especialista em endocrinologia e metabologia.',
        avatarUrl: null,
        speciality: 'Endocrinologia',
      }
    })

    const doctor = await prisma.doctor.findUnique({
      where: {
        doctorEmail: "joana.souza@example.com"
      }
    })

    expect(doctor).toBeTruthy()

    const findDoctorResponse = await request(app.server)
      .get(`/doctors/${doctor?.doctorId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(findDoctorResponse.status).toBe(200)
    expect(findDoctorResponse.body.doctor).toBeDefined()
  })
})