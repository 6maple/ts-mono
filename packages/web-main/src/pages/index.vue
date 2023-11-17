<script setup lang="ts">
const name = 'maple';
const handleClick = () => {
  //
};
</script>
<template>
  <div>
    <CcFoo />
    <ElText type="primary">{{ name }}</ElText>
    <ElButton type="primary" @click="handleClick">click</ElButton>
  </div>
</template>
<style lang="scss"></style>
