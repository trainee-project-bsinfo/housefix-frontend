export const flattenObject = (
  obj: object,
  prefix = ""
): Record<string, unknown> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const newKey = prefix ? `${prefix}${key}` : key;
    if (typeof value === "object" && !Array.isArray(value)) {
      Object.assign(acc, flattenObject(value as object, `${newKey}.`));
    } else {
      acc[newKey] = value;
    }
    return acc;
  }, {} as Record<string, unknown>);
};
