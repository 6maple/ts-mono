import type { ComponentObjectPropsOptions } from 'vue';

export const defineComponentProps = <PP extends ComponentObjectPropsOptions>(
  props: PP,
) => props;
