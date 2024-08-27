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
      '/controlApi': { 
        target: 'http://192.168.9.50:12024',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/controlApi/, '') 
      },
      '/smtApi': {
        // target: 'http://192.168.9.50:12026',
        //target：'http://192.168.9.52:12026',
        target: 'http://192.168.14.5:8089',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/smtApi/, '') 
      },
      '/dipApi': {
        target: 'http://192.168.9.50:12022',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dipApi/, '') 
      }
    }
  }
})
