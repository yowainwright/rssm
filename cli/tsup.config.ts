import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['cli/src/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  shims: true,
  outDir: 'cli/dist'
})