import { defineComponentProps } from '@zyi/web-ui';
import type { ElTable } from 'element-plus';
import type { ExtractPropTypes, PropType } from 'vue';

export const ccDataTableProps = defineComponentProps({
  data: Array as PropType<Record<string, unknown>[]>,
  attrs: Object as PropType<Parameters<Required<typeof ElTable>['setup']>[0]>,
});

export type CcDataTablePropsType = ExtractPropTypes<typeof ccDataTableProps>;
