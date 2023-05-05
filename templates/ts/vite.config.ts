import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'es2022',

    // babylon is at ~1500kb, so we need to increase the warning limit
    chunkSizeWarningLimit: 2000,

    rollupOptions: {
      output: {
        // place babylon in separate js chunk to improve caching
        manualChunks: {
          babylon: ['@babylonjs/core', '@babylonjs/loaders'],
          // babylongui: ['@babylonjs/gui'],
          // babyloninspect: ['@babylonjs/inspector'],
        },
      },
    },
  },
})
