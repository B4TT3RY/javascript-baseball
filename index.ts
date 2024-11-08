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

function getRandomNumber(): string {
  const set: Set<number> = new Set();

  while (set.size < 3) {
    const randomNumber = Math.floor(Math.random() * 9) + 1;
    set.add(randomNumber);
  }

  const returnRandomNumber = Array.from(set).join("");
  return returnRandomNumber;
}

async function inputAnswer(randomNumber: string) {
  const answer = await rl.question("숫자를 입력해주세요: ");

  if (answer === "2") {
    endGame();
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

function compareAnswer(randomNumber: string, answer: string): boolean {
  const strike = [...randomNumber]
    .map((element, index) => {
      if (answer[index] === element) return element;
    })
    .filter((element) => element !== undefined).length;

  const ball = [...answer]
    .map((element, index) => {
      if (randomNumber[index] !== element && randomNumber.includes(element))
        return element;
    })
    .filter((element) => element !== undefined).length;

  if (strike === 0 && ball > 0) {
    console.log(`${ball}볼`);
  } else if (strike > 0 && ball === 0) {
    console.log(`${strike}스트라이크`);
    if (strike === 3) {
      return true;
    }
  } else if (strike > 0 && ball > 0) {
    console.log(`${ball}볼 ${strike}스트라이크`);
  } else {
    console.log("낫싱");
  }

  return false;
}

function endGame() {
  console.log("\n애플리케이션이 종료되었습니다.");
  process.exit();
}

/*
예외처리 해야할 것
1. 사용자 입력값 중복 X
2. 숫자만 입력
3. 3자리만 입력
*/
