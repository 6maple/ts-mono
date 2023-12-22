import path from 'node:path';
import { parseVueRequest } from '@vitejs/plugin-vue';
import { normalizeUnixLikePath } from '@zyi/toolkit-core';
import type { Plugin } from 'vite';
import type { ExternalOption, OutputChunk } from 'rollup';

export interface LibBuildPluginOptions {
  sourceDir: string;
  libEntry: Record<string, string>;
  external?: ExternalOption;
}

export const createLibBuildPlugin = (options: LibBuildPluginOptions) => {
  const plugin: Plugin = {
    name: 'lib-build',
    enforce: 'pre',
    config: resolveLibBuildConfigFn(options),
    generateBundle(options, bundle) {
      const chunkFiles = <OutputChunk[]>(
        Object.values(bundle).filter((item) => item.type === 'chunk')
      );
      for (const chunk of chunkFiles) {
        const { imports } = chunk;
        chunk.code = replaceVueCssChunkImports(
          chunk.code,
          imports.filter((item) => checkIsVueCSSFileName(item)),
        );
      }
    },
  };
  return plugin;
};

const checkIsVueCSSFileName = (value: string) => {
  return value.endsWith('.vue.css.mjs');
};
const replaceVueCssChunkImports = (code: string, value: string[]) => {
  if (!value.length) {
    return code;
  }
  const replacer = getImportChunkReplacer(value);
  return replacer(code, (importPath) => {
    return importPath.replace(/\.css\.js$/, '.css');
  });
};
const getImportChunkReplacer = (value: string[]) => {
  const chunkFiles = value
    .map((file) => path.basename(file))
    .join('|')
    .replace(/\./g, '\\.');

  const chunkRE = new RegExp(
    `\\bimport\\s*["'](?<importPath>[^"']*(?:${chunkFiles}))["'];`,
    'g',
  );

  return (code: string, handleReplace: (importPath: string) => string) =>
    code.replace(
      chunkRE,
      // remove css import while preserving source map location
      (...args) => {
        const groups = args[args.length - 1];
        const { importPath } = groups;
        return `import "${handleReplace(importPath)}"`;
      },
    );
};

const resolveLibBuildConfigFn = (
  options: LibBuildPluginOptions,
): Plugin['config'] => {
  const { sourceDir, libEntry, external } = options;
  return (config) => {
    const { lib, rollupOptions } = config.build ?? {};
    return {
      ...config,
      build: {
        ...config.build,
        lib: {
          formats: ['es'],
          ...(typeof lib === 'object' ? lib : null),
          entry: libEntry,
        },
        rollupOptions: {
          ...rollupOptions,
          external,
          output: {
            chunkFileNames(chunkInfo) {
              return `${chunkInfo.name}.mjs`;
            },
            ...rollupOptions?.output,
            manualChunks(id) {
              return resolveManualChunk(id, sourceDir);
            },
          },
        },
      },
    };
  };
};

export const resolveManualChunk = (id: string, sourceDir: string) => {
  const value = normalizeUnixLikePath(id);
  const prefix = `${sourceDir}/`;
  if (!value.startsWith(prefix)) {
    return;
  }
  const idPath = value.replace(prefix, '');
  const extname = path.extname(idPath);
  const namePath = idPath.slice(0, -extname.length);
  const vueRequest = parseVueRequest(namePath);
  const { query } = vueRequest;
  if (query.vue) {
    const { type: queryType } = query;
    if (queryType === 'style') {
      return `${vueRequest.filename}.css`;
    }
    return vueRequest.filename;
  }
  if (extname === '.vue') {
    return idPath;
  }
  return namePath;
};
