<script setup lang="ts">
import { ElConfigProvider } from 'element-plus';

const size = 'small';
const zIndex = 3000;
</script>

<template>
  <ElConfigProvider :size="size" :z-index="zIndex">
    <RouterView />
  </ElConfigProvider>
</template>

<style lang="scss"></style>
