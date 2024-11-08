import * as readline from "node:readline/promises";
import { stdin, stdout } from "process";

const rl = readline.createInterface({ input: stdin, output: stdout });

// let input = "";

// rl.on("line", (line) => {
//   // console.log(line);
//   input = line;
//   console.log(input);
//   rl.close();
// });

startGame();

rl.on("close", () => {
  process.exit();
});

async function startGame() {
  const result = await rl.question(
    "게임을 새로 시작하려면 1, 종료하려면 9를 입력하세요.\n"
  );
  console.log("result: " + result);

  if (result === "1") {
    const randomNumber = getRandomNumber();
    console.log("컴퓨터가 숫자를 뽑았습니다.");
    rl.on("line", (answer: string) => {
      if (answer === '2') {
        endGame();
      }
      
      compareAnswer(randomNumber, answer);
    });
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

  const returnRandomNumber = Array.from(set).join('');
  return returnRandomNumber;
}

function compareAnswer(randomNumber: string, answer: string) {
  const strike = [...randomNumber].map((element, index) => {
    if(answer[index] === element) return element;
  }).filter((element) => element !== undefined).length;

  console.log(strike);
  console.log(`test: ${randomNumber} ${answer}`)
}

function endGame() {
  console.log("애플리케이션이 종료되었습니다.");
  return rl.close();
}



/*
예외처리 해야할 것
1. 사용자 입력값 중복 X
2. 숫자만 입력
3. 3자리만 입력
*/