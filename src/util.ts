import { BallNumbers } from "./types"

export const formatDate = (date?: Date): string => {
  if (!date) return "";
  return `${date.toISOString().split("T")[0].replace(/-/g, ". ")} ${
    date.toTimeString().split(" ")[0].substring(0, 5)
  }`;
};

export const generateComputerNumber = (digitNumber: number): BallNumbers => {
  const shuffledNumbers: BallNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  shuffledNumbers.sort(() => Math.random() - 0.5);
  return shuffledNumbers.splice(0, digitNumber);
};

export const getStrikeCount = (
  computerNumber: BallNumbers,
  userNumber: BallNumbers
): number => {
  return userNumber.filter((number, index) => computerNumber[index] === number)
    .length;
};

export const getBallCount = (
  computerNumber: BallNumbers,
  userNumber: BallNumbers
): number => {
  return userNumber.filter(
    (number, index) =>
      computerNumber[index] !== number && computerNumber.includes(number)
  ).length;
};