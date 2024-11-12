type SenderType = "computer" | "user";

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

  if(!input || input.value.trim() === "") {
    return;
  }

  addChat("user", input.value.trim());
  input.value = "";
}

const startGame = () => {
  
}

const inputAnswer = () => {

}

const compareAnswer = () => {

}