import { defineComponentProps } from '@zyi/web-ui';
import type { ExtractPropTypes, PropType } from 'vue';
import type {
  LayoutArea,
  LayoutAreaPanel,
} from '../../manager/shared/layout-manager';

export const lcAreaProps = defineComponentProps({
  area: {
    type: Object as PropType<LayoutArea>,
    required: true,
  },
});

export type LcAreaProps = ExtractPropTypes<typeof lcAreaProps>;

export const lcPanelContainerProps = defineComponentProps({
  panels: {
    type: Array as PropType<LayoutAreaPanel[]>,
    required: true,
  },
});

export type LcPanelContainerProps = ExtractPropTypes<
  typeof lcPanelContainerProps
>;

export const lcPanelProps = defineComponentProps({
  panel: {
    type: Object as PropType<LayoutAreaPanel>,
    required: true,
  },
});

export type LcPanelProps = ExtractPropTypes<typeof lcPanelProps>;
