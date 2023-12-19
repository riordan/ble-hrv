import { defineConfig } from 'vitest/config';
import svelte from 'vitest-svelte-plugin'; // This is a hypothetical plugin, replace with the actual plugin you are using

export default defineConfig({
  plugins: [
    svelte(), // Add the Svelte plugin to the Vitest configuration
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'istanbul'
    }
  },
});

