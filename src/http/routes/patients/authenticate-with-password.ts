import { compare } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/patients/sessions/password',
    {
      schema: {
        tags: ['pacientes'],
        summary: 'Autenticação de e-mail e senha para pacientes',
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
        response: {
          // ajuda na documentação das saídas possíveis
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const patientFromEmail = await prisma.patient.findUnique({
        where: {
          patientEmail: email,
        },
      })

      if (!patientFromEmail) {
        throw new BadRequestError('Invalid credentials')
      }

      const isPasswordValid = await compare(
        password,
        patientFromEmail.patientPassword,
      )

      if (!isPasswordValid) {
        throw new BadRequestError('Invalid credentials')
      }

      const token = await reply.jwtSign(
        {
          sub: patientFromEmail.patientId,
        },
        {
          sign: {
            expiresIn: '1d',
          },
        },
      )
      return reply.status(201).send({ token })
    },
  )
}
