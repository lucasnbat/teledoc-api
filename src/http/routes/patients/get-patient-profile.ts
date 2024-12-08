import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { BadRequestError } from "../_errors/bad-request-error";
import z from "zod";
import { auth } from "../middlewares/auth";

export async function getPatientProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).get(
    '/patient-profile',
    {
      schema: {
        tags: ['pacientes'],
        summary: 'Busca dados do paciente logado (perfil)',
        security: [{ bearerAuth: [] }], // para pedir token ao fazer req.
        response: {
          200: z.object({
            patientFinded: z.object({
              patientName: z.string().nullable(),
              patientEmail: z.string().email(),
              patientPhone: z.string(),
            })
          })
        }
      }
    },
    async (request, reply) => {
      const userIdFromToken = await request.getCurrentUserId()

      const patientFinded = await prisma.patient.findUnique({
        select: {
          patientName: true,
          patientEmail: true,
          patientPhone: true,
        },
        where: {
          patientId: userIdFromToken,
        }
      })

      if (!patientFinded) {
        throw new BadRequestError('Usuário não encontrado')
      }

      return reply.send({ patientFinded })
    }
  )
}