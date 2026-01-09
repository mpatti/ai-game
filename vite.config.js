import { defineConfig } from 'vite';

export default defineConfig({
  base: '/ai-game/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});
