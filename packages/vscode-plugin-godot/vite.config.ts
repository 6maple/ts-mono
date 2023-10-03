import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import type { UserConfig } from 'vite';

export default defineConfig(async () => {
  return <UserConfig>{
    plugins: [vue(), vueJsx()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/client/index.html'),
        },
      },
    },
  };
});
