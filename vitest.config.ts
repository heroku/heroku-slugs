import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    setupFiles: ['test/setup.ts'],
    testTimeout: 360_000,
    disableConsoleIntercept: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
    },
  },
})
