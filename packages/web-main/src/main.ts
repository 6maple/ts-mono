import '@unocss/reset/tailwind.css';
import 'uno.css';

import { setupLayouts } from 'virtual:generated-layouts';
import { ViteSSG } from 'vite-ssg';

import { routes } from 'vue-router/auto/routes';
import AppView from './app-view.vue';

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  AppView,
  {
    routes: setupLayouts(routes),
    base: import.meta.env.BASE_URL,
  },
  (ctx) => {
    ctx;
  },
);
