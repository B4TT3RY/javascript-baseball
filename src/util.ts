export const formatDate = (date?: Date): string => {
  if (!date) return "";
  return `${date.toISOString().split("T")[0].replace(/-/g, ". ")} ${
    date.toTimeString().split(" ")[0].substring(0, 5)
  }`;
};

export const generateComputerNumber = (digitNumber: number): number[] => {
  const shuffledNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  shuffledNumbers.sort(() => Math.random() - 0.5);
  return shuffledNumbers.splice(0, digitNumber);
};

export const getStrikeCount = (
  computerNumber: number[],
  userNumber: number[]
): number => {
  return userNumber.filter((number, index) => computerNumber[index] === number)
    .length;
};

export const getBallCount = (
  computerNumber: number[],
  userNumber: number[]
): number => {
  return userNumber.filter(
    (number, index) =>
      computerNumber[index] !== number && computerNumber.includes(number)
  ).length;
};