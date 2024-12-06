import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { UnauthorizedError } from "../_errors/unauthorized-error";
import { hash } from "bcryptjs";

export async function resetPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/patients/password/reset',
    {
      schema: {
        tags: ['pacientes'],
        summary: 'Redefina a senha usando um código enviado por e-mail',
        body: z.object({
          code: z.string(),
          patientPassword: z.string().min(8),
        }),
        response: {
          204: z.null(),
        }
      }
    },
    async (request, reply) => {
      const { code, patientPassword } = request.body

      // verifica se o código (code, um id) repassado é de um token válido
      const tokenFromCode = await prisma.token.findUnique({
        where: {
          id: code,
        }
      })

      if (!tokenFromCode) {
        throw new UnauthorizedError()
      }

      // faz hash da senha enviada
      const passwordHash = await hash(patientPassword, 6)

      await prisma.$transaction([
        prisma.patient.update({
          where: {
            patientId: tokenFromCode.patientIdFk
          },
          data: {
            patientPassword: passwordHash,
          }
        }),
        prisma.token.delete({
          where: {
            id: code,
          }
        })
      ])

      return reply.status(204).send()
    }
  )
}