export const formatDate = (date?: Date): string => {
  if (!date) return "";
  return `${date.toISOString().split("T")[0].replace(/-/g, ". ")} ${
    date.toTimeString().split(" ")[0].substring(0, 5)
  }`;
};
