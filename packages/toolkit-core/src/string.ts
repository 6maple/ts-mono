export const formatStr = (
  value: string,
  options?: unknown[] | Record<string, unknown>,
) => {
  if (!options) {
    return value;
  }
  let params = options as Record<string, unknown>;
  if (Array.isArray(options)) {
    params = Object.fromEntries(options.entries());
  }
  return value.replace(/{(\w+)}/g, (match, key, index) => {
    if (value[index - 1] === '{' && value[index + match.length] === '}') {
      return key;
    } else {
      return params[key] ?? '';
    }
  });
};
