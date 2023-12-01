import type { ProjectManifest } from '@pnpm/types';

export const getPackageManifest = (pkgPath: string) => {
  return require(pkgPath) as ProjectManifest;
};

export const getPackageDependencies = (pkgPath: string) => {
  const manifest = getPackageManifest(pkgPath);
  const {
    dependencies = {},
    peerDependencies = {},
    devDependencies = {},
    optionalDependencies = {},
  } = manifest;

  return {
    dependencies: Object.keys(dependencies),
    peerDependencies: Object.keys(peerDependencies),
    devDependencies: Object.keys(devDependencies),
    optionalDependencies: Object.keys(optionalDependencies),
  };
};
