import { buildApp } from './app'
import { env } from './env'

const app = buildApp()

app
  .listen({
    host: "0.0.0.0",
    port: env.PORT,
  })
  .then(() => {
    console.log(`HTTP Server running on port ${env.PORT}`);
  })
