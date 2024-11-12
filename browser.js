var addChat = function (sender, message) {
    var chat = document.createElement("p");
    if (sender === "computer") {
        chat.classList.add("computerChat");
    }
    else {
        chat.classList.add("userChat");
    }
    chat.innerText = message;
    var chatBox = document.querySelector("div.chatBox");
    chatBox === null || chatBox === void 0 ? void 0 : chatBox.append(chat);
    chatBox === null || chatBox === void 0 ? void 0 : chatBox.scrollTo(0, chatBox.scrollHeight);
};
var addUserChat = function () {
    var input = document.querySelector("input");
    if (!input || input.value.trim() === "") {
        return;
    }
    addChat("user", input.value.trim());
    input.value = "";
};
var startGame = function () {
};
var inputAnswer = function () {
};
var compareAnswer = function () {
};
