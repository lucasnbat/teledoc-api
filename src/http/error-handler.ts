import { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { BadRequestError } from "./routes/_errors/bad-request-error";
import { UnauthorizedError } from "./routes/_errors/unauthorized-error";
import { NotFoundError } from "./routes/_errors/not-found-error";
import { InternalServerError } from "./routes/_errors/internal-server-error";

// instanciando classe de error handlering do fastify e usando como tipo
type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Zod Validation Error',
      // flatten() retorna objeto resumido com erros do zod
      errors: error.flatten().fieldErrors,
    })
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      // pega mensagem dentro da classe de erro personalizada
      message: error.message
    })
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({
      message: error.message
    })
  }

  if (error instanceof NotFoundError) {
    return reply.status(404).send({
      message: error.message,
    })
  }

  if (error instanceof InternalServerError) {
    return reply.status(500).send({
      message: error.message,
    })
  }

  console.error(error)

  return reply.status(500).send({ message: 'Internal server error' })
}