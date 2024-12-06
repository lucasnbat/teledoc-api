import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '../middlewares/auth'
import { join } from 'path'
import { createWriteStream, mkdirSync, existsSync } from 'fs'
import { z } from 'zod'

export const uploadAvatarSchema = {
  tags: ['médicos'],
  summary: 'Faz upload de uma foto de perfil para o médico',
  security: [{ bearerAuth: [] }],
  consumes: ['multipart/form-data'],
  params: z.object({
    doctorId: z.string(),
  }),
  body: z.object({
    file: z.instanceof(Buffer, { message: 'O arquivo enviado deve ser válido' }),
  }),
  response: {
    200: z.object({
      message: z.string(),
      avatarUrl: z.string().url(),
    }),
    404: z.object({
      message: z.string(),
    }),
    400: z.object({
      message: z.string(),
    }),
  },
}

export async function uploadAvatar(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth) // Protege a rota com autenticação
    .post(
      '/doctors/:doctorId/avatar',
      {
        schema: uploadAvatarSchema, // Usa o schema atualizado
      },
      async (request, reply) => {
        const { doctorId } = request.params

        // Verifica se o médico existe
        const doctor = await prisma.doctor.findUnique({
          where: { doctorId },
        })

        if (!doctor) {
          return reply.status(404).send({ message: 'Médico não encontrado' })
        }

        // Cria a pasta "uploads" se não existir
        const uploadDir = join(__dirname, '../../../uploads')

        if (!existsSync(uploadDir)) {
          mkdirSync(uploadDir)
        }

        // Processamento do arquivo
        const data = await request.file()
        if (!data) {
          return reply.status(400).send({ message: 'Nenhum arquivo enviado' })
        }

        // Definir nome e caminho da foto
        const filename = `${doctorId}-${Date.now()}-${data.filename}`
        const filepath = join(uploadDir, filename)

        // Salvar arquivo
        await new Promise<void>((resolve, reject) => {
          const fileStream = createWriteStream(filepath)
          data.file.pipe(fileStream)
          data.file.on('end', resolve)
          data.file.on('error', reject)
        })

        // Atualizar campo no banco
        const avatarUrl = `/uploads/${filename}`
        await prisma.doctor.update({
          where: { doctorId },
          data: { avatarUrl },
        })

        return reply.status(200).send({
          message: 'Avatar atualizado com sucesso',
          avatarUrl,
        })
      },
    )
}
