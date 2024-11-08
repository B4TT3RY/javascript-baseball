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
    getRandomNumber();
    console.log("컴퓨터가 숫자를 뽑았습니다.");
    rl.on("line", (answer) => {
      if (answer === '2') {
        endGame();
      }
      
      compareAnswer(answer);
    });
  } else if (result === "9") {
    endGame();
  }
}

function getRandomNumber() {
  const set: Set<number> = new Set();

  while (set.size < 3) {
    const randomNumber = Math.floor(Math.random() * 9) + 1;
    set.add(randomNumber);
  }
}

function compareAnswer(answer: string) {
  console.log(`test: ${answer}`)
}

function endGame() {
  console.log("애플리케이션이 종료되었습니다.");
  return rl.close();
}
