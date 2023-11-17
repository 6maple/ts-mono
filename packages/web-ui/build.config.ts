import { readdirSync } from 'node:fs';
import { defineBuildConfig } from 'unbuild';
import type { BuildEntry } from 'unbuild';

const baseOutDir = 'dist';
const entryList = readdirSync('./src', { withFileTypes: true })
  .filter((item) => item.isFile() || item.isDirectory())
  .map((item) => {
    const { name } = item;
    if (item.isFile() && name.endsWith('.ts')) {
      return <BuildEntry>{
        input: `src/${name}`,
        name,
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
  entries: entryList,
  clean: true,
  declaration: true,
  rollup: {
    emitCJS: true,
  },
});
