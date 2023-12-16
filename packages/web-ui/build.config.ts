import fs from 'node:fs/promises';
import { defineBuildConfig } from 'unbuild';
import { baseOutDir, sourceEntryList } from './build-utils';
import type { BuildEntry } from 'unbuild';

export const entryList = sourceEntryList
  .map((item) => {
    const { name } = item;
    if (item.isFile() && name.endsWith('.ts')) {
      return <BuildEntry>{
        input: `src/${name}`,
        name: name.slice(0, -'.ts'.length),
        outDir: `${baseOutDir}`,
      };
    } else if (item.isDirectory()) {
      return <BuildEntry>{
        input: `src/${name}/index.ts`,
        name: `${name}/index`,
        outDir: `${baseOutDir}/${name}`,
      };
    }
    return null;
  })
  .filter(Boolean) as BuildEntry[];

export default defineBuildConfig({
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: false,
  },
  hooks: {
    'build:done': async () => {
      fs.writeFile(
        `${baseOutDir}/index.js`,
        'export * from "../src/index.ts";',
        {
          encoding: 'utf-8',
        },
      );
    },
  },
});
