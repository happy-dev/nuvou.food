import { defineConfig } from 'vitest/config'

// Unit tests for pure business logic (src/lib). No database, no browser.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
})
