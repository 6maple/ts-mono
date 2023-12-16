import path from 'node:path';
import fs from 'node:fs';
import type { ComponentResolver } from 'unplugin-vue-components';

const kebabCase = (value: string) => {
  return value.replace(/[A-Z]/g, (sub, index) => {
    const lower = sub.toLowerCase();
    if (index === 0) {
      return lower;
    }
    return `-${lower}`;
  });
};

export const createCcComponentResolver = (
  dir = path.join(process.cwd(), 'src/components').replace(/\\+/g, '/'),
): ComponentResolver => {
  return {
    type: 'component',
    resolve: async (name: string) => {
      if (!name.startsWith('Cc')) {
        return;
      }
      const namePath = kebabCase(name);
      const basePath = `${dir}/${namePath}`;
      if (fs.existsSync(`${basePath}.vue`)) {
        return `${basePath}.vue`;
      } else if (fs.existsSync(basePath)) {
        return `${basePath}/index`;
      }
    },
  };
};
