import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import type { UserConfig } from 'vite';

export default defineConfig(async () => {
  return <UserConfig>{
    plugins: [
      vue(),
      vueJsx(),
      {
        name: 'html-out',
        enforce: 'post',
        generateBundle(options, bundle) {
          const htmlChunkNameList = Object.keys(bundle).filter((key) =>
            key.endsWith('.html'),
          );
          for (const htmlChunkName of htmlChunkNameList) {
            const chunk = bundle[htmlChunkName];
            chunk.fileName = chunk.fileName.replace(/^src\/client\//, '');
          }
        },
      },
    ],
    server: {
      port: 9110,
    },
    experimental: {
      renderBuiltUrl(fileName, ctx) {
        if (ctx.type === 'asset' && ctx.hostType === 'html') {
          return `VSCODE_WEB_ROOT/${fileName}`;
        }
      },
    },
    build: {
      outDir: 'dist-client',
      rollupOptions: {
        input: {
          visualizer: resolve(__dirname, 'src/client/visualizer/index.html'),
        },
      },
    },
  };
});
