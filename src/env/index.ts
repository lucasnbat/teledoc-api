import "dotenv/config";
import { z } from "zod";

const envZodSchema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string(),
});

/* Evitar parar execução do programa com safeParse */
const _env = envZodSchema.safeParse(process.env);

if (_env.success === false) {
  console.log("Invalid environment variables", _env.error.format());

  throw Error("Invalid environment variables");
}

export const env = _env.data;
