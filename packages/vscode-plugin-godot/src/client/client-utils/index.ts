export const vscodeAPI =
  typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : null;
