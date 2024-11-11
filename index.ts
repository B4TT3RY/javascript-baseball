import * as readline from "node:readline/promises";
import { stdin, stdout } from "process";

const rl = readline.createInterface({ input: stdin, output: stdout });

startGame();

async function startGame() {
  const result = await rl.question(
    "게임을 새로 시작하려면 1, 종료하려면 9를 입력하세요.\n"
  );

  if (result === "1") {
    const randomNumber = getRandomNumber();
    console.log("\n컴퓨터가 숫자를 뽑았습니다.\n");
    console.log(`정답: ${randomNumber}`);

    inputAnswer(randomNumber);
  } else if (result === "9") {
    endGame();
  }
}

export function getRandomNumber(): string {
  const numberSet: Set<number> = new Set();

  while (numberSet.size < 3) {
    const randomNumber = Math.floor(Math.random() * 9) + 1;
    numberSet.add(randomNumber);
  }

  const returnRandomNumber = Array.from(numberSet).join("");
  return returnRandomNumber;
}

async function inputAnswer(randomNumber: string) {
  const answer = await rl.question("숫자를 입력해주세요: ");
  if (answer === "2") {
    endGame();
  }

  if (!inputValidate(answer)) {
    console.log("잘못된 값을 입력했습니다.");
    return inputAnswer(randomNumber);
  }

  const isStrike = compareAnswer(randomNumber, answer);
  if (isStrike) {
    console.log("\n3개의 숫자를 모두 맞히셨습니다.");
    console.log("-------게임 종료-------\n");
    startGame();
  } else {
    inputAnswer(randomNumber);
  }
}

export function inputValidate(input: string) {
  if (isNaN(Number(input))) return false;
  if (input.length !== 3) return false;

  const inputSet = new Set([...input]);
  if (inputSet.size !== 3) return false;

  return true;
}

export function compareAnswer(randomNumber: string, answer: string): boolean {
  const strike = getStrike(randomNumber, answer);
  const ball = getBall(randomNumber, answer);

  if (strike === 0 && ball > 0) {
    console.log(`${ball}볼`);
  } else if (strike > 0 && ball === 0) {
    console.log(`${strike}스트라이크`);
  } else if (strike > 0 && ball > 0) {
    console.log(`${ball}볼 ${strike}스트라이크`);
  } else {
    console.log("낫싱");
  }

  return strike === 3;
}

export function getStrike(randomNumber: string, answer: string): number {
  const strike = [...randomNumber]
    .map((element, index) => {
      if (answer[index] === element) return element;
    })
    .filter((element) => element !== undefined).length;

  return strike;
}

export function getBall(randomNumber: string, answer: string): number {
  const ball = [...answer]
    .map((element, index) => {
      if (randomNumber[index] !== element && randomNumber.includes(element))
        return element;
    })
    .filter((element) => element !== undefined).length;

  return ball;
}

function endGame() {
  console.log("\n애플리케이션이 종료되었습니다.");
  process.exit();
}
