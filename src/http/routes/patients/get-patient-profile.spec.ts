import { buildApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { beforeEach, describe, expect, it } from "vitest";
import request from 'supertest'

describe('Perfil de usuário', () => {
  let app: FastifyInstance

  beforeEach(async () => {
    app = buildApp()
    await app.ready()

    await prisma.patient.deleteMany()
  })

  it("deve ser capaz de buscar dados do perfil", async () => {
    // cria usuário
    const response = await request(app.server)
      .post('/patients')
      .send({
        patientName: "John Doe",
        patientEmail: "johndoe@teste.com",
        patientPhone: "(66) 9.8877-8877",
        patientPassword: "john123!@#",
      });

    expect(response.status).toBe(201);

    // valida no banco
    const patient = await prisma.patient.findUnique({
      where: {
        patientEmail: 'johndoe@teste.com'
      }
    });
    expect(patient).toBeTruthy();

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

    // extração e validação do token
    const { token } = loginResponse.body
    expect(token).toBeDefined()
    expect(typeof token).toBe('string')

    const profileResponse = await request(app.server)
      .get('/patient-profile')
      .set('Authorization', `Bearer ${token}`)

    expect(profileResponse.status).toBe(200)
    expect(profileResponse.body).toHaveProperty('patientFinded')
    expect(profileResponse.body.patientFinded.patientEmail).toBe('johndoe@teste.com'); // Verifica os dados retornados
  })

  it("não deve ser capaz de buscar dados do perfil se não estiver autenticado", async () => {
    // cria usuário
    const response = await request(app.server)
      .post('/patients')
      .send({
        patientName: "John Doe",
        patientEmail: "johndoe@teste.com",
        patientPhone: "(66) 9.8877-8877",
        patientPassword: "john123!@#",
      });

    expect(response.status).toBe(201);

    // valida no banco
    const patient = await prisma.patient.findUnique({
      where: {
        patientEmail: 'johndoe@teste.com'
      }
    });
    expect(patient).toBeTruthy();

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

    // extração e validação do token
    const { token } = loginResponse.body
    expect(token).toBeDefined()
    expect(typeof token).toBe('string')

    const profileResponse = await request(app.server)
      .get('/patient-profile')

    expect(profileResponse.status).toBe(401)
  })
})