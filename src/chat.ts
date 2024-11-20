import { handleUserInput } from "./index.js";
import { store } from "./store.js";
import { GameState, Player } from "./types.js";

//✔️알림창 추가
export const addAlert = (message: string) => {
  const alert = document.createElement("p");
  alert.classList.add("alert");
  alert.innerText = message;

  if (store.currentState === GameState.RunningGame) {
    store.statistics.at(-1)?.gameLog.push({
      sender: "alert",
      message,
    });
  }

  const chatBox = document.querySelector("div.chatBox");
  chatBox?.append(alert);
  chatBox?.scrollTo(0, chatBox.scrollHeight);
};

//✔️채팅 추가
export const addChat = (sender: Player, message: string) => {
  const chat = document.createElement("p");
  if (sender === "computer") {
    chat.classList.add("computerChat");
  } else {
    chat.classList.add("userChat");
  }
  chat.innerText = message;

  if (store.currentState === GameState.RunningGame) {
    store.statistics.at(-1)?.gameLog.push({
      sender,
      message,
    });
  }

  const chatBox = document.querySelector("div.chatBox");
  chatBox?.append(chat);
  chatBox?.scrollTo(0, chatBox.scrollHeight);
};

//✔️사용자 채팅 추가
export const addUserChat = () => {
  const inputElement = document.querySelector("input");
  if (!inputElement) return;

  const userInput = inputElement.value.trim();
  if (userInput === "") return;

  addChat("user", userInput);
  inputElement.value = "";

  handleUserInput(userInput);
};
