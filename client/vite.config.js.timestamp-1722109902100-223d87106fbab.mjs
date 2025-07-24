// vite.config.js
import { defineConfig } from "file:///media/alihamza/software's/Coding%20Data/PROJECTS/learning_web/deploy/client/node_modules/vite/dist/node/index.js";
import react from "file:///media/alihamza/software's/Coding%20Data/PROJECTS/learning_web/deploy/client/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react({ include: /\.(mdx|js|jsx|ts|tsx)$/ })],
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:3000',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        }
      }
    },
    chunkSizeWarningLimit: 1e3
    // Increase the chunk size limit to 1000 kB
  },
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        ".js": "jsx"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvbWVkaWEvYWxpaGFtemEvc29mdHdhcmUncy9Db2RpbmcgRGF0YS9QUk9KRUNUUy9sZWFybmluZ193ZWIvZGVwbG95L2NsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL21lZGlhL2FsaWhhbXphL3NvZnR3YXJlJ3MvQ29kaW5nIERhdGEvUFJPSkVDVFMvbGVhcm5pbmdfd2ViL2RlcGxveS9jbGllbnQvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL21lZGlhL2FsaWhhbXphL3NvZnR3YXJlJ3MvQ29kaW5nJTIwRGF0YS9QUk9KRUNUUy9sZWFybmluZ193ZWIvZGVwbG95L2NsaWVudC92aXRlLmNvbmZpZy5qc1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCh7IGluY2x1ZGU6IC9cXC4obWR4fGpzfGpzeHx0c3x0c3gpJC8gfSldLFxuICAvLyBzZXJ2ZXI6IHtcbiAgLy8gICBwcm94eToge1xuICAvLyAgICAgJy9hcGknOiB7XG4gIC8vICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCcsXG4gIC8vICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgLy8gICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKSxcbiAgLy8gICAgIH0sXG4gIC8vICAgfSxcbiAgLy8gfSxcbiAgYnVpbGQ6IHtcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzKGlkKSB7XG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xuICAgICAgICAgICAgLy8gQ3JlYXRlIGEgc2VwYXJhdGUgY2h1bmsgZm9yIGVhY2ggbnBtIHBhY2thZ2VcbiAgICAgICAgICAgIHJldHVybiBpZC50b1N0cmluZygpLnNwbGl0KCdub2RlX21vZHVsZXMvJylbMV0uc3BsaXQoJy8nKVswXS50b1N0cmluZygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDAsIC8vIEluY3JlYXNlIHRoZSBjaHVuayBzaXplIGxpbWl0IHRvIDEwMDAga0JcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZm9yY2U6IHRydWUsXG4gICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgIGxvYWRlcjoge1xuICAgICAgICAnLmpzJzogJ2pzeCcsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBa1osU0FBUyxvQkFBb0I7QUFDL2EsT0FBTyxXQUFXO0FBR2xCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLEVBQUUsU0FBUyx5QkFBeUIsQ0FBQyxDQUFDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFVdEQsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sYUFBYSxJQUFJO0FBQ2YsY0FBSSxHQUFHLFNBQVMsY0FBYyxHQUFHO0FBRS9CLG1CQUFPLEdBQUcsU0FBUyxFQUFFLE1BQU0sZUFBZSxFQUFFLENBQUMsRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUUsU0FBUztBQUFBLFVBQ3hFO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSx1QkFBdUI7QUFBQTtBQUFBLEVBQ3pCO0FBQUEsRUFDQSxjQUFjO0FBQUEsSUFDWixPQUFPO0FBQUEsSUFDUCxnQkFBZ0I7QUFBQSxNQUNkLFFBQVE7QUFBQSxRQUNOLE9BQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
