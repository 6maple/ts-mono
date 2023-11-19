<script setup lang="ts">
import { ref } from 'vue';
import { useAsyncState } from '@vueuse/core';
import { Refresh } from '@element-plus/icons-vue';
import { addIssueCountComment, getIssueCommentCount } from './api';

const { state, isLoading, execute } = useAsyncState(
  getIssueCommentCount,
  0,
  {},
);

const pending = ref(false);

const handleClick = async () => {
  pending.value = true;
  try {
    await execute();
    await addIssueCountComment(state.value + 1);
    await execute();
  } finally {
    pending.value = false;
  }
};
</script>
<template>
  <span v-loading="isLoading || pending" px-2>
    <ElText type="info"> 访问量：{{ state }} </ElText>
    <ElButton
      m-l-1
      link
      :icon="Refresh"
      circle
      title="refresh and add count"
      @click="handleClick"
    />
  </span>
</template>
<style lang="scss"></style>
