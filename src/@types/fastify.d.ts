import { Enterprise, Member } from '@prisma/client'
import 'fastify'

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>
  }
}