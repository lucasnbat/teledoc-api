import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { prisma } from '@/lib/prisma'
import { auth } from '../middlewares/auth'
import { join } from 'path'
import { createWriteStream, mkdirSync, existsSync } from 'fs'
import { z } from 'zod'
import { InternalServerError } from '../_errors/internal-server-error'

export const uploadAvatarSchema = {
  tags: ['médicos'],
  summary: 'Faz upload de uma foto de perfil para o médico',
  security: [{ bearerAuth: [] }],
  consumes: ['multipart/form-data'], // Swagger UI reconhece multipart/form-data
  params: z.object({
    doctorId: z.string(), // Valida apenas o ID do médico
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
    .register(auth)
    .post(
      '/doctors/:doctorId/avatar',
      {
        schema: uploadAvatarSchema,
      },
      async (request, reply) => {
        const { doctorId } = request.params

        const doctor = await prisma.doctor.findUnique({
          where: { doctorId },
        })

        if (!doctor) {
          return reply.status(404).send({ message: 'Médico não encontrado' })
        }

        // Caminho absoluto para a pasta de uploads
        const uploadDir = join(__dirname, '/uploads')
        console.log(`Pasta de uploads configurada na rota: ${uploadDir}`)

        // Cria a pasta "uploads" se não existir
        if (!existsSync(uploadDir)) {
          mkdirSync(uploadDir)
          console.log('Pasta de uploads criada com sucesso!')
        }

        // Processa o arquivo enviado
        const data = await request.file()
        if (!data) {
          return reply.status(400).send({ message: 'Nenhum arquivo enviado' })
        }

        // Define o nome e o caminho do arquivo
        const filename = `${doctorId}-${Date.now()}-${data.filename}`
        const filepath = join(uploadDir, filename)

        console.log(`Salvando arquivo em: ${filepath}`)

        // salvar arquivo
        await new Promise<void>((resolve, reject) => {
          const fileStream = createWriteStream(filepath)
          data.file.pipe(fileStream)
          data.file.on('end', resolve)
          data.file.on('error', reject)
        })

        // Gera a URL completa para o avatar
        const address = app.server.address()
        if (address && typeof address === 'object' && 'port' in address) {
          const avatarUrl = `${request.protocol}://${request.hostname}:${address.port}/uploads/${filename}`
          console.log(`URL gerada: ${avatarUrl}`)

          // Atualiza o campo no banco de dados
          await prisma.doctor.update({
            where: { doctorId },
            data: { avatarUrl },
          })

          return reply.status(200).send({
            message: 'Avatar atualizado com sucesso',
            avatarUrl,
          })
        } else {
          console.error('Não foi possível determinar a porta do servidor.')
          throw new InternalServerError("Erro interno do servidor")
        }
      },
    )
}
