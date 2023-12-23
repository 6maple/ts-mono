<script setup lang="ts">
import { computed } from 'vue';
import { resolveGroupedAreaPanelList } from '../../manager/shared/layout-manager';
import { lcAreaProps } from './props';
import LcAreaPanelContainer from './lc-area-panel-container.vue';
import type { StyleValue } from 'vue';

const props = defineProps(lcAreaProps);
const typeToPanel = computed(() => {
  return resolveGroupedAreaPanelList(props.area);
});
const resolveSizeStyle = (
  value?: string,
  sizeName: 'height' | 'width' = 'height',
) => {
  const res: Partial<StyleValue> = { [sizeName]: value };
  if (
    value === undefined ||
    value === null ||
    value === '' ||
    value === 'auto'
  ) {
    res.flex = '1 1 auto';
  }
  return res;
};
const style = computed(() => {
  return resolveSizeStyle(props.area.width, 'width');
});
const topStyle = computed(() => {
  return resolveSizeStyle(props.area.topHeight);
});
const bottomStyle = computed(() => {
  return resolveSizeStyle(props.area.bottomHeight);
});
</script>
<template>
  <div
    class="lc-area"
    :class="[`lc-area--${area.type}--${area.name}`]"
    h-full
    flex
    flex-1
    flex-col
    justify-center
    :style="style"
  >
    <template v-if="typeToPanel.top">
      <div class="lc-area-top" :style="topStyle">
        <LcAreaPanelContainer :panels="typeToPanel.top" />
      </div>
    </template>
    <template v-if="typeToPanel.bottom">
      <div class="lc-area-bottom" :style="bottomStyle">
        <LcAreaPanelContainer :panels="typeToPanel.bottom" />
      </div>
    </template>
  </div>
</template>
<style lang="scss"></style>
