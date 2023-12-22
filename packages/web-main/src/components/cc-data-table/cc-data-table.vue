<script setup lang="ts">
import { ccDataTableProps } from './props';
defineProps(ccDataTableProps);
</script>
<template>
  <div>
    <el-table :data="data" v-bind="attrs" style="width: 100%">
      <el-table-column prop="date" label="Date" width="180" />
      <el-table-column prop="name" label="Name" width="180" />
      <el-table-column prop="address" label="Address" />
    </el-table>
  </div>
</template>
<style lang="scss"></style>
