<script setup lang="ts">
import { computed } from 'vue';
import { LcHead } from '../lc-head';
import { LcCanvas } from '../lc-canvas';
import { LcArea } from '../lc-area';
import { lcLayoutProps } from './props';

const props = defineProps(lcLayoutProps);

const typeToLayoutArea = computed(() => props.areaRecord || {});
</script>
<template>
  <div flex flex-col h-full>
    <div class="lc-layout-top" h-sm>
      <LcHead :areas="typeToLayoutArea.top" />
    </div>
    <div class="lc-layout-main" flex flex-1>
      <template v-if="typeToLayoutArea.left">
        <div class="lc-layout-left" flex h-full>
          <template v-for="item in typeToLayoutArea.left" :key="item.name">
            <LcArea :area="item" />
          </template>
        </div>
      </template>
      <div class="lc-layout-center" h-full flex flex-1>
        <LcCanvas :areas="typeToLayoutArea.center" />
      </div>
      <template v-if="typeToLayoutArea.right">
        <div class="lc-layout-right" flex h-full>
          <template v-for="item in typeToLayoutArea.right" :key="item.name">
            <LcArea :area="item" />
          </template>
        </div>
      </template>
    </div>
  </div>
</template>
<style lang="scss"></style>
