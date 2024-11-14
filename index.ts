type SenderType = "computer" | "user";
enum State {
  StartGame = 0,
  RunningGame = 1,
  EndGame = 2,
}

document.addEventListener("DOMContentLoaded", () => {
  startGame();

  document
    .querySelector("#sendButton")
    ?.addEventListener("click", () => addUserChat());
});

let state = State.StartGame;
let randomNumber = "";

const addAlert = (message: string) => {
  const alert = document.createElement("p");
  alert.classList.add("alert");
  alert.innerText = message;

  const chatBox = document.querySelector("div.chatBox");
  chatBox?.append(alert);
  chatBox?.scrollTo(0, chatBox.scrollHeight);
};

const addChat = (sender: SenderType, message: string) => {
  const chat = document.createElement("p");
  if (sender === "computer") {
    chat.classList.add("computerChat");
  } else {
    chat.classList.add("userChat");
  }
  chat.innerText = message;

  const chatBox = document.querySelector("div.chatBox");
  chatBox?.append(chat);
  chatBox?.scrollTo(0, chatBox.scrollHeight);
};

const addUserChat = () => {
  const input = document.querySelector("input");
  if (!input) return;

  const message = input.value.trim();
  if (message === "") return;

  addChat("user", message);
  input.value = "";

  handleUserInput(message);
};

const handleUserInput = (input: string) => {
  if (state === State.StartGame) {
    if (input === "1") {
      randomNumber = getRandomNumber();
      addAlert("컴퓨터가 숫자를 뽑았습니다.");
      addChat("computer", "세자리 숫자를 입력해주세요.");
      state = State.RunningGame;
    } else if (input === "9") {
      endGame();
    }
  } else if (state === State.RunningGame) {
    if (input === "2") return endGame();
    if (!inputValidate(input))
      return addChat("computer", "잘못된 값을 입력했습니다.");
    const isStrike = compareAnswer(randomNumber, input);
    if (isStrike) {
      addChat("computer", "3개의 숫자를 모두 맞히셨습니다.");
      addAlert("게임 종료");
      startGame();
    }
  }
};

export const getRandomNumber = (): string => {
  const numberSet: Set<number> = new Set();

  while (numberSet.size < 3) {
    const randomNumber = Math.floor(Math.random() * 9) + 1;
    numberSet.add(randomNumber);
  }

  const returnRandomNumber = Array.from(numberSet).join("");
  return returnRandomNumber;
};

export function inputValidate(input: string) {
  if (isNaN(Number(input))) return false;
  if (input.length !== 3) return false;

  const inputSet = new Set(Array.from(input));
  if (inputSet.size !== 3) return false;

  return true;
}

export const compareAnswer = (randomNumber: string, answer: string) => {
  const strike = getStrike(randomNumber, answer);
  const ball = getBall(randomNumber, answer);

  if (strike === 0 && ball > 0) {
    addChat("computer", `${ball}볼`);
  } else if (strike > 0 && ball === 0) {
    addChat("computer", `${strike}스트라이크`);
  } else if (strike > 0 && ball > 0) {
    addChat("computer", `${ball}볼 ${strike}스트라이크`);
  } else {
    addChat("computer", "낫싱");
  }

  return strike === 3;
};

export const getStrike = (randomNumber: string, answer: string): number => {
  const strike = Array.from(randomNumber)
    .map((element, index) => {
      if (answer[index] === element) return element;
    })
    .filter((element) => element !== undefined).length;

  return strike;
};

export const getBall = (randomNumber: string, answer: string): number => {
  const ball = Array.from(answer)
    .map((element, index) => {
      if (randomNumber[index] !== element && randomNumber.includes(element))
        return element;
    })
    .filter((element) => element !== undefined).length;

  return ball;
};

const startGame = () => {
  state = State.StartGame;
  addChat("computer", "게임을 새로 시작하려면 1, 종료하려면 9를 입력하세요.");
};

const endGame = () => {
  addAlert(
    "애플리케이션이 종료되었습니다.\n게임을 시작하시려면 새로고침 해주세요."
  );
  state = State.EndGame;
};
