import { buildApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { beforeEach, describe, expect, it } from "vitest";
import request from 'supertest'

describe("Autenticação", () => {
  let app: FastifyInstance

  beforeEach(async () => {
    app = buildApp()
    await app.ready()

    await prisma.patient.deleteMany();
  })

  it("deve criar um usuário e logar com e-mail e senha", async () => {
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
  })

  it("não deve ser capaz de se autenticar com e-mail incorreto", async () => {
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

    const loginResponse = await request(app.server)
      .post('/patients/sessions/password')
      .send({
        email: 'johndoeIncorrectEmail@teste.com',
        password: 'john123!@#'
      })

    expect(loginResponse.status).toBe(400)
  })

  it("não deve ser capaz de se autenticar com senha incorreta", async () => {
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
        password: 'john123!@#IncorrectPassword'
      })

    expect(loginResponse.status).toBe(400)
  })
})