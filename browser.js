var State;
(function (State) {
    State[State["StartGame"] = 0] = "StartGame";
    State[State["RunningGame"] = 1] = "RunningGame";
    State[State["EndGame"] = 2] = "EndGame";
})(State || (State = {}));
document.addEventListener("DOMContentLoaded", function () {
    startGame();
});
var state = State.StartGame;
var randomNumber = "";
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var addUserChat = function () {
    var input = document.querySelector("input");
    if (!input)
        return;
    var message = input.value.trim();
    if (message === "")
        return;
    addChat("user", message);
    input.value = "";
    handleUserInput(message);
};
var handleUserInput = function (input) {
    if (state === State.StartGame) {
        if (input === "1") {
            randomNumber = getRandomNumber();
            addChat("computer", "컴퓨터가 숫자를 뽑았습니다.");
            addChat("computer", "세자리 숫자를 입력해주세요.");
            state = State.RunningGame;
        }
        else if (input === "9") {
            endGame();
        }
    }
    else if (state === State.RunningGame) {
        if (input === "2") {
            return endGame();
        }
        if (!inputValidate(input)) {
            return addChat("computer", "잘못된 값을 입력했습니다.");
        }
        var isStrike = compareAnswer(randomNumber, input);
        if (isStrike) {
            addChat("computer", "3개의 숫자를 모두 맞히셨습니다.");
            addChat("computer", "-------게임 종료-------");
            startGame();
        }
    }
};
var startGame = function () {
    state = State.StartGame;
    addChat("computer", "게임을 새로 시작하려면 1, 종료하려면 9를 입력하세요.");
};
var compareAnswer = function (randomNumber, answer) {
    var strike = getStrike(randomNumber, answer);
    var ball = getBall(randomNumber, answer);
    if (strike === 0 && ball > 0) {
        addChat("computer", "".concat(ball, "\uBCFC"));
    }
    else if (strike > 0 && ball === 0) {
        addChat("computer", "".concat(strike, "\uC2A4\uD2B8\uB77C\uC774\uD06C"));
    }
    else if (strike > 0 && ball > 0) {
        addChat("computer", "".concat(ball, "\uBCFC ").concat(strike, "\uC2A4\uD2B8\uB77C\uC774\uD06C"));
    }
    else {
        addChat("computer", "낫싱");
    }
    return strike === 3;
};
var endGame = function () {
    addChat("computer", "애플리케이션이 종료되었습니다.\n게임을 시작하시려면 새로고침 해주세요.");
    state = State.EndGame;
};
function getRandomNumber() {
    var numberSet = new Set();
    while (numberSet.size < 3) {
        var randomNumber_1 = Math.floor(Math.random() * 9) + 1;
        numberSet.add(randomNumber_1);
    }
    var returnRandomNumber = Array.from(numberSet).join("");
    return returnRandomNumber;
}
function inputValidate(input) {
    if (isNaN(Number(input)))
        return false;
    if (input.length !== 3)
        return false;
    var inputSet = new Set(Array.from(input));
    if (inputSet.size !== 3)
        return false;
    return true;
}
function getStrike(randomNumber, answer) {
    var strike = Array.from(randomNumber)
        .map(function (element, index) {
        if (answer[index] === element)
            return element;
    })
        .filter(function (element) { return element !== undefined; }).length;
    return strike;
}
function getBall(randomNumber, answer) {
    var ball = Array.from(answer)
        .map(function (element, index) {
        if (randomNumber[index] !== element && randomNumber.includes(element))
            return element;
    })
        .filter(function (element) { return element !== undefined; }).length;
    return ball;
}
