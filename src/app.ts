import fastifySwagger from "@fastify/swagger"
import fastify from "fastify"
import fastifySwaggerUI from '@fastify/swagger-ui'
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod"
import fastifyCors from "@fastify/cors"
import { errorHandler } from "./http/error-handler"

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

    //TODO: plugin de autenticação aqui

    app.register(fastifyCors)

    return app
}