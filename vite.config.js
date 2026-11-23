import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { '/api': 'http://localhost:3001' },
  },
  test: {
    include: ['shared/**/*.test.js', 'server/**/*.test.js', 'src/**/*.test.js'],
  },
});
