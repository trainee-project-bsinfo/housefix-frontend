export const getLocalDateFormat = (date: Date | string) => {
  if (typeof date === "object") {
    date = date.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }
  const [day, month, year] = date.split(".");
  return `${year}-${month}-${day}`;
};
