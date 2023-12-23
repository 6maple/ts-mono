<script setup lang="ts">
import { LcLayout } from '../lc-layout';
import type { TypeToLayoutArea } from '../../manager/shared/layout-manager';

const areaRecord: TypeToLayoutArea = {
  left: [
    {
      name: 'left-area',
      type: 'left',
      width: '320px',
      panelList: [
        {
          name: 'prop',
          title: 'prop',
          type: 'top',
          renderElement(previousValue) {
            if (previousValue) {
              return;
            }
            const el = document.createElement('div');
            el.innerText = 'hi prop';
            return el;
          },
        },
        {
          name: 'propKey',
          title: 'propKey',
          type: 'top',
          renderElement(previousValue) {
            if (previousValue) {
              return;
            }
            const el = document.createElement('div');
            el.innerText = 'hi propKey';
            return el;
          },
        },
        {
          name: 'name',
          title: 'name',
          type: 'bottom',
          renderElement(previousValue) {
            if (previousValue) {
              return;
            }
            const el = document.createElement('div');
            el.innerText = 'hi name';
            return el;
          },
        },
      ],
    },
  ],
};
</script>
<template>
  <div h-full>
    <LcLayout :area-record="areaRecord" />
  </div>
</template>
<style lang="scss"></style>
