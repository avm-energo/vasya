import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'robots.txt'],
            manifest: {
                name: 'Vasya',
                short_name: 'Vasya',
                description: 'Vasya description',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            },
            workbox: {
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024 // 5 МБ
            }
        })
    ],
    server: {
        port: 8080,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        }
    },
    test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: './vitest.setup.js',
    },

})