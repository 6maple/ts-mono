import type { ExtractPropTypes, PropType } from 'vue';
import type { TypeToLayoutArea } from '../../manager/shared/layout-manager';

export const lcLayoutProps = {
  areaRecord: {
    type: Object as PropType<TypeToLayoutArea>,
    required: true,
  },
} as const;

export type LcLayoutProps = ExtractPropTypes<typeof lcLayoutProps>;
