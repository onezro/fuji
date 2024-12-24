// vite.config.ts
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///D:/%E5%8C%97%E6%96%97%E6%99%BA%E8%81%94/opcenter2/node_modules/.pnpm/vite@5.4.9_@types+node@20.16.11_sass@1.79.5/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/%E5%8C%97%E6%96%97%E6%99%BA%E8%81%94/opcenter2/node_modules/.pnpm/@vitejs+plugin-vue@5.1.4_vite@5.4.9_@types+node@20.16.11_sass@1.79.5__vue@3.5.12_typescript@5.4.5_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/%E5%8C%97%E6%96%97%E6%99%BA%E8%81%94/opcenter2/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@5.4.9_@types+node@20.16.11_sass@1.79.5__vue@3.5.12_typescript@5.4.5_/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///D:/%E5%8C%97%E6%96%97%E6%99%BA%E8%81%94/opcenter2/vite.config.ts";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxcdTUzMTdcdTY1OTdcdTY2N0FcdTgwNTRcXFxcb3BjZW50ZXIyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxcdTUzMTdcdTY1OTdcdTY2N0FcdTgwNTRcXFxcb3BjZW50ZXIyXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi8lRTUlOEMlOTclRTYlOTYlOTclRTYlOTklQkElRTglODElOTQvb3BjZW50ZXIyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXG5cbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcbi8vIGltcG9ydCBheGlvcyBmcm9tIFwiYXhpb3NcIjtcblxuLy8gY29uc3QgYXBpID0gd2luZG93LmlwQ29uZmluZy5iYXNlVXJsXG5cbi8vIGxldCBhcGk9Jydcbi8vIGF4aW9zLmdldCgnLi4vLi4vcHVibGljL2NvbmZpZy5qc29uJykudGhlbihyZXM9PlxuLy8gICBhcGk9cmVzLmRhdGEuYXBpVXJsXG4vLyApXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgdnVlSnN4KCksXG5cbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKVxuICAgIH1cbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcHJveHk6IHtcbiAgICAgICcvY29udHJvbEFwaSc6IHsgXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xOTIuMTY4LjkuNTA6MTIwMjQnLFxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9jb250cm9sQXBpLywgJycpIFxuICAgICAgfSxcbiAgICAgICcvc210QXBpJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC45LjUwOjEyMDI2JyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvc210QXBpLywgJycpIFxuICAgICAgfSxcbiAgICAgICcvZGlwQXBpJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC45LjUwOjEyMDIyJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvZGlwQXBpLywgJycpIFxuICAgICAgfSxcbiAgICAgICcvc2NyQXBpJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC45LjUwOjEyMDI1JyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvc2NyQXBpLywgJycpIFxuICAgICAgfSxcbiAgICAgICcvYXN5QXBpJzoge1xuICAgICAgICB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC45LjUwOjEyMDIxJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXN5QXBpLywgJycpIFxuICAgICAgfSxcbiAgICAgIFxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlEsU0FBUyxlQUFlLFdBQVc7QUFFOVMsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUo0SCxJQUFNLDJDQUEyQztBQWVoTSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsRUFFVDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxJQUN0RDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLGVBQWU7QUFBQSxRQUNiLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxpQkFBaUIsRUFBRTtBQUFBLE1BQ3JEO0FBQUEsTUFDQSxXQUFXO0FBQUEsUUFDVCxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsYUFBYSxFQUFFO0FBQUEsTUFDakQ7QUFBQSxNQUNBLFdBQVc7QUFBQSxRQUNULFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxhQUFhLEVBQUU7QUFBQSxNQUNqRDtBQUFBLE1BQ0EsV0FBVztBQUFBLFFBQ1QsUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDLFNBQVMsS0FBSyxRQUFRLGFBQWEsRUFBRTtBQUFBLE1BQ2pEO0FBQUEsTUFDQSxXQUFXO0FBQUEsUUFDVCxRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxTQUFTLENBQUMsU0FBUyxLQUFLLFFBQVEsYUFBYSxFQUFFO0FBQUEsTUFDakQ7QUFBQSxJQUVGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
