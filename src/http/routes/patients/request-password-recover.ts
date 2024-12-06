import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export async function requestPasswordRecover(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/patients/password/recover',
    {
      schema: {
        tags: ['pacientes'],
        summary: 'Solicitar código para recuperação de senha',
        body: z.object({
          patientEmail: z.string().email(),
        }),
        response: {
          201: z.object({
            code: z.string(),
          }),
        }
      }
    },
    async (request, reply) => {
      const { patientEmail } = request.body

      const patientFindedByEmail = await prisma.patient.findUnique({
        where: {
          patientEmail,
        }
      })

      if (!patientFindedByEmail) {
        return reply.status(201).send()
      }

      // cria um registro relacionando token ao usuário e pega o id desse registro
      const { id: code } = await prisma.token.create({
        data: {
          type: 'PASSWORD_RECOVER',
          patientIdFk: patientFindedByEmail.patientId,
        }
      })

      return reply.status(201).send({ code })
    }
  )
}