export const unflattenObject = <T extends object>(
  obj: Record<string, unknown>,
  delimiter = ".",
): T => {
  const result: Record<string, unknown> = {};

  Object.entries(obj).forEach(([key, value]) => {
    const keys = key.split(delimiter);
    let current = result;

    keys.forEach((part, index) => {
      if (index === keys.length - 1) {
        current[part] = value;
      } else {
        current[part] = current[part] ?? {};
        current = current[part] as Record<string, unknown>;
      }
    });
  });

  return result as T;
};
