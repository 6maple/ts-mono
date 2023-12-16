export const normalizeUnixLikePath = (value: string) => {
  return value.replace(/\\+/g, '/');
};
