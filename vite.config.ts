import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  // Load environment variables based on the current mode

  // Define the configuration object with types
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/v1': {
          target: 'https://vignesh-todo-backend.onrender.com',
          changeOrigin: true,
        },
      },
    },
  };
});