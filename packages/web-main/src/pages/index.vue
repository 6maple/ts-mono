<script setup lang="ts">
import { ZFoo } from '@zyi/web-ui';
import type { CcDataTablePropsType } from '@/components/cc-data-table/props';

const tabaleData = [
  { name: 'xx' },
  { name: 'xx' },
  { name: 'xx' },
  { name: 'xx' },
  { name: 'xx' },
] as CcDataTablePropsType['data'];
const attrs = { stripe: true } as CcDataTablePropsType['attrs'];
</script>
<template>
  <div mt-10 mb-10 border border-gray>
    <ccDataTable :data="tabaleData" :attrs="attrs" />
  </div>

  <div p-10 flex justify-center>
    <div border border-gray>
      <CcIssueCommentCount />
      <ZFoo />
    </div>
  </div>
</template>
<style lang="scss"></style>
