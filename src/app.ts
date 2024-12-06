import fastifySwagger from "@fastify/swagger"
import fastify from "fastify"
import fastifySwaggerUI from '@fastify/swagger-ui'
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod"
import fastifyCors from "@fastify/cors"
import { errorHandler } from "./http/error-handler"
import { env } from "./env"
import fastifyJwt from "@fastify/jwt"
import { createNewAccount } from "./http/routes/patients/create-new-account"
import { authenticateWithPassword } from "./http/routes/auth/authenticate-with-password"

export function buildApp() {
  const app = fastify().withTypeProvider<ZodTypeProvider>()

  app.setSerializerCompiler(serializerCompiler)

  app.setValidatorCompiler(validatorCompiler)

  app.setErrorHandler(errorHandler)

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'TeleDoc',
        description: '',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          }
        }
      }
    },
    transform: jsonSchemaTransform,
  })


  app.register(fastifySwaggerUI, {
    routePrefix: '/docs'
  })

  app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  })

  app.register(fastifyCors)

  // Pacientes

  app.register(createNewAccount)
  app.register(authenticateWithPassword)

  return app
}