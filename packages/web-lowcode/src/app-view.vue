<script setup lang="ts">
import { ElConfigProvider } from 'element-plus';
import { UI } from './constant';
</script>

<template>
  <ElConfigProvider :size="UI.size" :z-index="UI.zIndex">
    <RouterView />
  </ElConfigProvider>
</template>

<style lang="scss"></style>
