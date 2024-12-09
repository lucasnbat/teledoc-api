import { buildApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { beforeAll, describe, expect, it } from "vitest";
import request from 'supertest'

describe('Resetar senha', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = buildApp()
    await app.ready()

    await prisma.patient.deleteMany()
  })

  it('deve ser capaz de resetar a senha usando um código enviado pelo e-mail', async () => {
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

    // requisitar redefinição de senha
    const requestPasswordRecoverResponse = await request(app.server)
      .post('/patients/password/recover')
      .send({
        patientEmail: 'johndoe@teste.com'
      })

    expect(requestPasswordRecoverResponse.status).toBe(201)
    expect(requestPasswordRecoverResponse.body.code).toBeDefined()
    expect(typeof requestPasswordRecoverResponse.body.code).toBe('string')

    let codeToReset = requestPasswordRecoverResponse.body.code;

    const resetResponse = await request(app.server)
      .post('/patients/password/reset')
      .send({
        code: codeToReset,
        patientPassword: 'john123!@#Changed'
      })

    expect(resetResponse.status).toBe(204)
  })
})