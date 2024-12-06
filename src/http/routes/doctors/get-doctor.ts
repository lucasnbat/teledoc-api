import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '../middlewares/auth'
import { NotFoundError } from '../_errors/not-found-error'

export async function getDoctor(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/doctors/:doctorId',
      {
        schema: {
          tags: ['médicos'],
          summary: 'Lista um médico em específico',
          security: [{ bearerAuth: [] }],
          params: z.object({
            doctorId: z.string(),
          }),
          response: {
            200: z.object({
              doctor: z.object({
                doctorEmail: z.string(),
                doctorName: z.string(),
                doctorPhone: z.string(),
                numberOfPatients: z.number(),
                rating: z.number(),
                yearsOfExperience: z.number(),
                periodOfWork: z.string(),
                about: z.string(),
                avatarUrl: z.string().nullable(),
              })
            }),
          },
        },
      },
      async (request, reply) => {
        await request.getCurrentUserId()

        const { doctorId } = request.params

        const doctor = await prisma.doctor.findUnique({
          where: {
            doctorId,
          },
          select: {
            doctorEmail: true,
            doctorName: true,
            doctorPhone: true,
            numberOfPatients: true,
            rating: true,
            yearsOfExperience: true,
            periodOfWork: true,
            about: true,
            avatarUrl: true,
          }
        })

        if (!doctor) {
          throw new NotFoundError("Médico não encontrado!")
        }

        return reply.status(200).send({ doctor })
      },
    )
}
