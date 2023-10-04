import { defineBuildConfig } from 'unbuild';

const isBuild = process.env.IS_BUILD === 'true';

export default defineBuildConfig({
  entries: [{ input: 'src/host/index.ts', format: 'cjs', name: 'index' }],
  externals: ['vscode'],
  clean: true,
  replace: {
    INJECT_IS_BUILD: JSON.stringify(isBuild),
  },
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
});
