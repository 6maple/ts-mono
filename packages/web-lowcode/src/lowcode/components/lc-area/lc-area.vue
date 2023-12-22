<script setup lang="ts">
import { computed } from 'vue';
import { resolveGroupedAreaPanelList } from '../../manager/shared/layout-manager';
import { lcAreaProps } from './props';
const props = defineProps(lcAreaProps);
const typeToPanel = computed(() => {
  return resolveGroupedAreaPanelList(props.area);
});
</script>
<template>
  <div
    class="lc-area"
    :class="[`lc-area--${area.type}--${area.name}`]"
    flex
    flex-1
    justify-center
  >
    lc-area
    <span>{{ typeToPanel }}</span>
  </div>
</template>
<style lang="scss"></style>
