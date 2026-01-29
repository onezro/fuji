// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///E:/FUJI/opcenter2/node_modules/.pnpm/vite@5.4.9_@types+node@20.16.11_sass@1.79.5/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/FUJI/opcenter2/node_modules/.pnpm/@vitejs+plugin-vue@5.1.4_vi_7e9df32871ac343ccfd600150d990499/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///E:/FUJI/opcenter2/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1._43ca2f65d06c332e5f4c192dca8e648f/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { resolve } from "path";
var __vite_injected_original_dirname = "E:\\FUJI\\opcenter2";
var __vite_injected_original_import_meta_url = "file:///E:/FUJI/opcenter2/vite.config.ts";
var vite_config_default = defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
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
    vueJsx()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
      "@vue-office/excel": resolve(__vite_injected_original_dirname, "node_modules/@vue-office/excel/lib/v3/index.js")
    }
  },
  server: {
    proxy: {
      "/controlApi": {
        target: "http://192.168.1.237:12024",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/controlApi/, "")
      },
      "/smtApi": {
        target: "http://192.168.1.237:12026",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/smtApi/, "")
      },
      "/dipApi": {
        target: "http://192.168.1.237:12022",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dipApi/, "")
      },
      "/packApi": {
        target: "http://192.168.1.237:12023",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/packApi/, "")
      },
      "/scrApi": {
        target: "http://192.168.1.237:12025",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/scrApi/, "")
      },
      "/asyApi": {
        target: "http://192.168.1.237:12021",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/asyApi/, "")
      },
      "/reportApi": {
        target: "http://192.168.1.237:12014",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/reportApi/, "")
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxGVUpJXFxcXG9wY2VudGVyMlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcRlVKSVxcXFxvcGNlbnRlcjJcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L0ZVSkkvb3BjZW50ZXIyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcblxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xyXG5pbXBvcnQge3Jlc29sdmV9IGZyb20gJ3BhdGgnXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgY3NzOiB7XHJcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAgIHNjc3M6IHtcclxuICAgICAgICBhcGk6ICdtb2Rlcm4tY29tcGlsZXInXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gICAgYnVpbGQ6IHtcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgZXh0ZXJuYWw6IFtcclxuICAgICAgICAvLyBcdTZERkJcdTUyQTBcdTRFRTVcdTRFMEJcdTg4NENcclxuICAgICAgICAvQGZ1bGxjYWxlbmRhclxcLy4qL1xyXG4gICAgICBdXHJcbiAgICB9XHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoKSxcclxuICAgIHZ1ZUpzeCgpLFxyXG5cclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxyXG4gICAgICAgJ0B2dWUtb2ZmaWNlL2V4Y2VsJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdub2RlX21vZHVsZXMvQHZ1ZS1vZmZpY2UvZXhjZWwvbGliL3YzL2luZGV4LmpzJylcclxuICAgIH1cclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgcHJveHk6IHtcclxuICAgICAgJy9jb250cm9sQXBpJzogeyBcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC4xLjIzNzoxMjAyNCcsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9jb250cm9sQXBpLywgJycpIFxyXG4gICAgICB9LFxyXG4gICAgICAnL3NtdEFwaSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC4xLjIzNzoxMjAyNicsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9zbXRBcGkvLCAnJykgXHJcbiAgICAgIH0sXHJcbiAgICAgICcvZGlwQXBpJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xOTIuMTY4LjEuMjM3OjEyMDIyJyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2RpcEFwaS8sICcnKSBcclxuICAgICAgfSxcclxuICAgICAgJy9wYWNrQXBpJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xOTIuMTY4LjEuMjM3OjEyMDIzJyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL3BhY2tBcGkvLCAnJykgXHJcbiAgICAgIH0sXHJcbiAgICAgICcvc2NyQXBpJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xOTIuMTY4LjEuMjM3OjEyMDI1JyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL3NjckFwaS8sICcnKSBcclxuICAgICAgfSxcclxuICAgICAgJy9hc3lBcGknOiB7XHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzE5Mi4xNjguMS4yMzc6MTIwMjEnLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXN5QXBpLywgJycpIFxyXG4gICAgICB9LFxyXG4gICAgICcvcmVwb3J0QXBpJzoge1xyXG4gICAgICB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC4xLjIzNzoxMjAxNCcsXHJcbiAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL3JlcG9ydEFwaS8sICcnKSBcclxuICAgIH0sXHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJPLFNBQVMsZUFBZSxXQUFXO0FBRTlRLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFDbkIsU0FBUSxlQUFjO0FBTHRCLElBQU0sbUNBQW1DO0FBQXNHLElBQU0sMkNBQTJDO0FBTWhNLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLEtBQUs7QUFBQSxJQUNILHFCQUFxQjtBQUFBLE1BQ25CLE1BQU07QUFBQSxRQUNKLEtBQUs7QUFBQSxNQUNQO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNFLE9BQU87QUFBQSxJQUNQLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQTtBQUFBLFFBRVI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLE9BQU87QUFBQSxFQUVUO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLE1BQ25ELHFCQUFxQixRQUFRLGtDQUFXLGdEQUFnRDtBQUFBLElBQzNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsZUFBZTtBQUFBLFFBQ2IsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLGlCQUFpQixFQUFFO0FBQUEsTUFDckQ7QUFBQSxNQUNBLFdBQVc7QUFBQSxRQUNULFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxhQUFhLEVBQUU7QUFBQSxNQUNqRDtBQUFBLE1BQ0EsV0FBVztBQUFBLFFBQ1QsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLGFBQWEsRUFBRTtBQUFBLE1BQ2pEO0FBQUEsTUFDQSxZQUFZO0FBQUEsUUFDVixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsY0FBYyxFQUFFO0FBQUEsTUFDbEQ7QUFBQSxNQUNBLFdBQVc7QUFBQSxRQUNULFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxhQUFhLEVBQUU7QUFBQSxNQUNqRDtBQUFBLE1BQ0EsV0FBVztBQUFBLFFBQ1QsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLGFBQWEsRUFBRTtBQUFBLE1BQ2pEO0FBQUEsTUFDRCxjQUFjO0FBQUEsUUFDYixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsZ0JBQWdCLEVBQUU7QUFBQSxNQUNwRDtBQUFBLElBQ0E7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
