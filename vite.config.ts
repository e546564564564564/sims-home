import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const base = '/sims-home/'

export default defineConfig({
  base,
  build: { chunkSizeWarningLimit: 1500 },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Casa',
        short_name: 'Casa',
        lang: 'it',
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'landscape',
        theme_color: '#F3F1EC',
        background_color: '#F3F1EC',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,png,svg}'], maximumFileSizeToCacheInBytes: 5 * 1024 * 1024 },
    }),
  ],
})
