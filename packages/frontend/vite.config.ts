import vue from '@vitejs/plugin-vue';
import { URL, fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import graphqlCodegen from 'vite-plugin-graphql-codegen';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    graphqlCodegen(),
    vue(),
    checker({ vueTsc: true }),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'MTG Treachery',
        short_name: 'Treachery',
        theme_color: '#000000',
        display: 'fullscreen',
        icons: [
          {
            src: 'app_icons/192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'app_icons/512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'app_icons/512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      devOptions: {
        enabled: process.env.NODE_ENV == 'development',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@generated': fileURLToPath(new URL('./generated', import.meta.url)),
    },
  },
  server: {
    host: true,
  },
});
