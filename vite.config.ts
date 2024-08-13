import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import axios from "axios";

// const api = window.ipConfing.baseUrl

// let api=''
// axios.get('../../public/config.json').then(res=>
//   api=res.data.apiUrl
// )

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),

  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/all': {
        target: 'http://192.168.9.50:12024',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/all/, '') 
      },
      '/smtApi': {
        target: 'http://192.168.9.50:12026',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/smtApi/, '') 
      },
      // '/smtapi2': {
      //   target: 'http://192.168.9.52:8521',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/smtapi2/, '') 
      // },
      '/dipApi': {
        target: 'http://192.168.14.5:8087',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dipApi/, '') 
      }
    }
  }
})
