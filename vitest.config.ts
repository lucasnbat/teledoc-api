// vitest.config.ts
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Define o alias '@' para o diretório 'src'
    },
  },
  test: {
    environment: './prisma/prisma-test-environment/prisma-test-environment.ts', // Caminho para o ambiente
    globals: true,
  },
});
