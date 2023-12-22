import type { ExtractPropTypes, PropType } from 'vue';
import type { LayoutArea } from '../../manager/shared/layout-manager';

export const lcAreaProps = {
  area: {
    type: Object as PropType<LayoutArea>,
    required: true,
  },
} as const;

export type LcAreaProps = ExtractPropTypes<typeof lcAreaProps>;
