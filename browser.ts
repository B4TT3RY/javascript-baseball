import { getRandomNumber } from './index.ts';

type SenderType = "computer" | "user";
enum State {
  START_GAME = 0,
  RUNNING_GAME = 1
}

let state = State.START_GAME;
let randomNumber = "";

const addChat = (sender: SenderType, message: string) => {
  const chat = document.createElement("p");
  if(sender === "computer") {
    chat.classList.add("computerChat");
  } else {
    chat.classList.add("userChat");
  }
  chat.innerText = message;

  const chatBox = document.querySelector("div.chatBox");
  chatBox?.append(chat);
  chatBox?.scrollTo(0, chatBox.scrollHeight);
}

const addUserChat = () => {
  const input = document.querySelector("input");
  if (!input) return;

  const message = input.value.trim();
  if (message === '') return;

  addChat("user", message);
  input.value = "";

  handleUserInput(message);
}

const handleUserInput = (input: string) => {
  switch (state as State) {
    case State.START_GAME:
      if (input === '1') {
        randomNumber = getRandomNumber();
      } else if (input === '9') {

      }
      break;
    case State.RUNNING_GAME:

      break;
  }
}

const startGame = () => {

}

const inputAnswer = () => {

}

const compareAnswer = () => {

}

const endGame = () => {
  addChat('computer', '애플리케이션이 종료되었습니다.');
}