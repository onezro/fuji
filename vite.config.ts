import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import {resolve} from 'path'
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
    build: {
    rollupOptions: {
      external: [
        // 添加以下行
        /@fullcalendar\/.*/
      ]
    }
  },
  plugins: [
    vue(),
    vueJsx(),

  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
       '@vue-office/excel': resolve(__dirname, 'node_modules/@vue-office/excel/lib/v3/index.js')
    }
  },
  server: {
    proxy: {
      '/controlApi': { 
        target: 'http://192.168.1.237:12024',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/controlApi/, '') 
      },
      '/smtApi': {
        target: 'http://192.168.1.237:12026',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/smtApi/, '') 
      },
      '/dipApi': {
        target: 'http://192.168.1.237:12022',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dipApi/, '') 
      },
      '/packApi': {
        target: 'http://192.168.1.237:12023',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/packApi/, '') 
      },
      '/scrApi': {
        target: 'http://192.168.1.237:12025',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/scrApi/, '') 
      },
      '/asyApi': {
        target: 'http://192.168.1.237:12021',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/asyApi/, '') 
      },
     '/reportApi': {
      target: 'http://192.168.1.237:12014',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/reportApi/, '') 
    },
    }
  }
})
