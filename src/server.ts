import { buildApp } from './app'
// TODO: env

const app = buildApp()

app
  .listen({
    host: "0.0.0.0",
    port: 3000,
  })
  .then(() => {
    console.log(`HTTP Server running on port 3000`);
  })
