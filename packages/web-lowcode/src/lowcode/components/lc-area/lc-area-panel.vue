<script setup lang="ts">
import { onMounted, onUpdated, ref } from 'vue';
import { lcPanelProps } from './props';
import type { LayoutAreaPanelRenderType } from '../../manager/shared/layout-manager';

const props = defineProps(lcPanelProps);

const panelRef = ref<HTMLElement>();
let previousElement: HTMLElement | undefined | null = null;
const renderPanel = (type: LayoutAreaPanelRenderType) => {
  const el = panelRef.value;
  if (!el) {
    return;
  }
  const { renderElement } = props.panel;
  const child = renderElement(previousElement, el, type);
  if (child === previousElement) {
    return;
  }
  if (previousElement) {
    if (child) {
      previousElement.replaceWith(child);
    } else {
      previousElement.remove();
    }
  } else if (child) {
    el.appendChild(child);
  }
  previousElement = child;
};
onMounted(() => {
  renderPanel('mount');
});
onUpdated(() => {
  renderPanel('update');
});
</script>
<template>
  <div ref="panelRef" h-full class="lc-area-panel">
    <!-- replace with child -->
  </div>
</template>
<style lang="scss" scoped></style>
