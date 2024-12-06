import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function createNewAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/patients',
    {
      schema: {
        tags: ['pacientes'], // agregador de rotas pra swagger
        summary: 'Crie uma nova conta de paciente', // descrição para swagger
        body: z.object({
          patientName: z.string(),
          patientEmail: z.string().email(),
          patientPhone: z.string(),
          patientPassword: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const {
        patientName,
        patientEmail,
        patientPhone,
        patientPassword } = request.body

      const patientWithSameEmail = await prisma.patient.findUnique({
        where: {
          patientEmail,
        },
      })

      if (patientWithSameEmail) {
        throw new BadRequestError('Não foi possível logar!')
      }

      const passwordHash = await hash(patientPassword, 6)

      await prisma.patient.create({
        data: {
          patientName,
          patientEmail,
          patientPhone,
          patientPassword: passwordHash,
        },
      })

      return reply.status(201).send()
    },
  )
}
