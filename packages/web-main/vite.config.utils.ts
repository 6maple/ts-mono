import path from 'node:path';
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
    resolve: (name: string) => {
      if (!name.startsWith('Cc')) {
        return;
      }
      const namePath = kebabCase(name);
      return `${dir}/${namePath}/index`;
    },
  };
};
// name CcFoo
// import CcFoo from 'src/components/cc-foo';
