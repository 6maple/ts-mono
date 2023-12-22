import path from 'node:path';
import { defineConfig } from 'vite';
import Vue from '@vitejs/plugin-vue';
import Unocss from 'unocss/vite';
import WebfontDownload from 'vite-plugin-webfont-dl';
import createDTSPlugin from 'vite-plugin-dts';
import { normalizeUnixLikePath } from '@zyi/toolkit-core';
import { getPackageDependencies } from '@zyi/build';
import { baseOutDir, sourceEntryList } from './build-utils';
import { createLibBuildPlugin } from './vite.config.utils';

const sourceDir = normalizeUnixLikePath(path.join(__dirname, 'src'));
const libEntry = Object.fromEntries(
  sourceEntryList
    .map((item) => {
      const { name } = item;
      if (item.isFile() && name.endsWith('.ts')) {
        return [name.slice(0, -'.ts'.length), `./src/${name}`];
      } else if (item.isDirectory()) {
        return [`${name}/index`, `./src/${name}/index`];
      }
      return null;
    })
    .filter(Boolean) as string[][],
);

export default defineConfig({
  build: {
    outDir: baseOutDir,
    minify: false,
    cssCodeSplit: true,
  },

  plugins: [
    Vue({
      include: [/\.vue$/],
    }),

    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    Unocss(),

    // https://github.com/feat-agency/vite-plugin-webfont-dl
    WebfontDownload(),

    createDTSPlugin({
      root: __dirname,
      tsconfigPath: path.join(__dirname, './tsconfig.web.json'),
      insertTypesEntry: true,
    }),
    createLibBuildPlugin({
      sourceDir,
      libEntry,
      external: getPackageDependencies(path.join(__dirname, './package.json'))
        .dependencies,
    }),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    include: ['test/**/*.test.ts'],
    environment: 'jsdom',
    deps: {
      optimizer: { web: { include: ['@vue', '@vueuse', 'vue-demi'] } },
    },
  },
});
