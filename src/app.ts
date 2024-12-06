import fastifySwagger from "@fastify/swagger"
import fastify from "fastify"
import fastifySwaggerUI from '@fastify/swagger-ui'
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod"
import fastifyCors from "@fastify/cors"
import { errorHandler } from "./http/error-handler"
import { env } from "./env"
import fastifyJwt from "@fastify/jwt"
import { createNewAccount } from "./http/routes/patients/create-new-account"
import { authenticateWithPassword } from "./http/routes/patients/authenticate-with-password"
import { getDoctors } from "./http/routes/doctors/get-doctors"
import { getDoctor } from "./http/routes/doctors/get-doctor"
import { getPatientProfile } from "./http/routes/patients/get-patient-profile"
import { requestPasswordRecover } from "./http/routes/patients/request-password-recover"
import { resetPassword } from "./http/routes/patients/reset-password"
import fastifyMultipart from "@fastify/multipart"
import { uploadAvatar } from "./http/routes/doctors/upload-avatar"
import fastifyStatic from "@fastify/static"
import { join } from "path"

export function buildApp() {
  const app = fastify().withTypeProvider<ZodTypeProvider>()

  app.setSerializerCompiler(serializerCompiler)

  app.setValidatorCompiler(validatorCompiler)

  app.setErrorHandler(errorHandler)

  app.register(fastifyCors)

  app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  })

  app.register(fastifyMultipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // Limita os uploads a 5MB
    },
  })

  // Configurando a pasta de uploads que será servida no link retornado pela api:
  const uploadsDir = join(__dirname, '/http/routes/doctors/uploads') 

  // Configuração para servir os arquivos estáticos (imagens), gerar o link:
  app.register(fastifyStatic, {
    root: uploadsDir, 
    prefix: '/uploads/', 
  })

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

  // Pacientes
  app.register(createNewAccount)
  app.register(authenticateWithPassword)
  app.register(getPatientProfile)
  app.register(requestPasswordRecover)
  app.register(resetPassword)

  // Médicos
  app.register(getDoctors)
  app.register(getDoctor)
  app.register(uploadAvatar)

  return app
}