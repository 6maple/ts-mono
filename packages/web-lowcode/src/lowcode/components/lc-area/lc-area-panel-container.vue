<script setup lang="ts">
import { lcPanelContainerProps } from './props';

defineProps(lcPanelContainerProps);
</script>
<template>
  <div h-full class="lc-area-panel-container">
    <ElTabs h-full class="lc-area-panel-container" type="border-card">
      <template v-for="item in panels" :key="item.name">
        <ElTabPane :label="item.name">
          <template #label>
            {{ typeof item.title === 'function' ? item.title() : item.title }}
          </template>
          <div h-full class="lc-area-panel">
            {{ item }}
          </div>
        </ElTabPane>
      </template>
    </ElTabs>
  </div>
</template>
<style lang="scss" scoped></style>
