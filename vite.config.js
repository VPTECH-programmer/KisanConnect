import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        farmer: resolve(__dirname, 'farmer.html'),
        consumer: resolve(__dirname, 'consumer.html'),
        admin: resolve(__dirname, 'admin.html'),
        kyc: resolve(__dirname, 'kyc.html'),
        tracking: resolve(__dirname, 'tracking.html'),
        payment: resolve(__dirname, 'payment.html'),
      },
    },
  },
});
