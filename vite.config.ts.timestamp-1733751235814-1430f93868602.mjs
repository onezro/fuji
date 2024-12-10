// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///E:/opcenter2/node_modules/.pnpm/vite@5.4.9_@types+node@20.16.11_sass@1.79.5/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/opcenter2/node_modules/.pnpm/@vitejs+plugin-vue@5.1.4_vite@5.4.9_@types+node@20.16.11_sass@1.79.5__vue@3.5.12_typescript@5.4.5_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///E:/opcenter2/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@5.4.9_@types+node@20.16.11_sass@1.79.5__vue@3.5.12_typescript@5.4.5_/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///E:/opcenter2/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    vueJsx()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  server: {
    proxy: {
      "/controlApi": {
        target: "http://192.168.9.50:12024",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/controlApi/, "")
      },
      "/smtApi": {
        target: "http://192.168.9.50:12026",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/smtApi/, "")
      },
      "/dipApi": {
        target: "http://192.168.9.50:12022",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dipApi/, "")
      },
      "/scrApi": {
        target: "http://192.168.9.50:12025",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/scrApi/, "")
      },
      "/asyApi": {
        target: "http://192.168.9.50:12021",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/asyApi/, "")
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxvcGNlbnRlcjJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXG9wY2VudGVyMlxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovb3BjZW50ZXIyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcblxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xyXG4vLyBpbXBvcnQgYXhpb3MgZnJvbSBcImF4aW9zXCI7XHJcblxyXG4vLyBjb25zdCBhcGkgPSB3aW5kb3cuaXBDb25maW5nLmJhc2VVcmxcclxuXHJcbi8vIGxldCBhcGk9JydcclxuLy8gYXhpb3MuZ2V0KCcuLi8uLi9wdWJsaWMvY29uZmlnLmpzb24nKS50aGVuKHJlcz0+XHJcbi8vICAgYXBpPXJlcy5kYXRhLmFwaVVybFxyXG4vLyApXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtcclxuICAgIHZ1ZSgpLFxyXG4gICAgdnVlSnN4KCksXHJcblxyXG4gIF0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcclxuICAgIH1cclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgcHJveHk6IHtcclxuICAgICAgJy9jb250cm9sQXBpJzogeyBcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC45LjUwOjEyMDI0JyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2NvbnRyb2xBcGkvLCAnJykgXHJcbiAgICAgIH0sXHJcbiAgICAgICcvc210QXBpJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xOTIuMTY4LjkuNTA6MTIwMjYnLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvc210QXBpLywgJycpIFxyXG4gICAgICB9LFxyXG4gICAgICAnL2RpcEFwaSc6IHtcclxuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC45LjUwOjEyMDIyJyxcclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2RpcEFwaS8sICcnKSBcclxuICAgICAgfSxcclxuICAgICAgJy9zY3JBcGknOiB7XHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzE5Mi4xNjguOS41MDoxMjAyNScsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9zY3JBcGkvLCAnJykgXHJcbiAgICAgIH0sXHJcbiAgICAgICcvYXN5QXBpJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xOTIuMTY4LjkuNTA6MTIwMjEnLFxyXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXN5QXBpLywgJycpIFxyXG4gICAgICB9LFxyXG4gICAgICBcclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBME4sU0FBUyxlQUFlLFdBQVc7QUFFN1AsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUpnSCxJQUFNLDJDQUEyQztBQWVwTCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsRUFFVDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxJQUN0RDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLGVBQWU7QUFBQSxRQUNiLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxpQkFBaUIsRUFBRTtBQUFBLE1BQ3JEO0FBQUEsTUFDQSxXQUFXO0FBQUEsUUFDVCxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsYUFBYSxFQUFFO0FBQUEsTUFDakQ7QUFBQSxNQUNBLFdBQVc7QUFBQSxRQUNULFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxhQUFhLEVBQUU7QUFBQSxNQUNqRDtBQUFBLE1BQ0EsV0FBVztBQUFBLFFBQ1QsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLGFBQWEsRUFBRTtBQUFBLE1BQ2pEO0FBQUEsTUFDQSxXQUFXO0FBQUEsUUFDVCxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsYUFBYSxFQUFFO0FBQUEsTUFDakQ7QUFBQSxJQUVGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
