import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '../middlewares/auth'

export async function getDoctors(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/doctors',
      {
        schema: {
          tags: ['médicos'],
          summary: 'Lista todos os médicos cadastros',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              doctors: z.array(
                z.object({
                  doctorName: z.string(),
                  doctorPhone: z.string(),
                  doctorEmail: z.string().email(),
                  numberOfPatients: z.number(),
                  rating: z.number(),
                  yearsOfExperience: z.number(),
                  periodOfWork: z.string(),
                  about: z.string(),
                  avatarUrl: z.string().nullable(),
                })
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        await request.getCurrentUserId()

        const doctors = await prisma.doctor.findMany({
          select: {
            doctorName: true,
            doctorEmail: true,
            about: true,
            avatarUrl: true,
            doctorPhone: true,
            numberOfPatients: true,
            periodOfWork: true,
            rating: true,
            yearsOfExperience: true,
          }
        })

        return reply.status(200).send({ doctors })
      },
    )
}
