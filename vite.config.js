// SPDX-License-Identifier: MIT

import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: 'https://sweetpotato.github.io/ijinden-deck-builder/',
  build: {
    outDir: 'public',
    rollupOptions: {
      plugins: [
        visualizer({
          filename: 'dist/stats.html',
        }),
      ],
      output: {
        manualChunks: {
          vendor: ['dexie', 'react-dom/client', 'react-router'],
        },
      },
    },
  },
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './setupTests.js',
    testTimeout: 60000,
  },
})
