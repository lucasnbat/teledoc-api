import { buildApp } from "@/app";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { beforeEach, describe, expect, it } from "vitest";
import request from 'supertest'

describe("Criação de conta de paciente", () => {
  let app: FastifyInstance

  beforeEach(async () => {
    app = buildApp()
    await app.ready()

    await prisma.patient.deleteMany();
  })

  it("deve ser capaz de criar um usuário paciente no sistema", async () => {
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
  })
})