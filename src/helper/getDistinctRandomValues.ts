export const getDistinctRandomValues = <T>(arr: T[], count: number): T[] => {
  const result: T[] = [];
  const copy = arr.slice();
  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy[index]);
    copy.splice(index, 1);
  }
  return result;
};
