import { defineComponentProps } from '@zyi/web-ui';
import type { ExtractPropTypes, PropType } from 'vue';
import type { TypeToLayoutArea } from '../../manager/shared/layout-manager';

export const lcLayoutProps = defineComponentProps({
  areaRecord: {
    type: Object as PropType<TypeToLayoutArea>,
    required: true,
  },
});

export type LcLayoutProps = ExtractPropTypes<typeof lcLayoutProps>;
