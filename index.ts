type SenderType = "computer" | "user"; //컴퓨터, 사람 도메인
enum State { //진행 상태 도메인
  StartGame = "1",
  RunningGame = "2",
  EndGame = "9",
}

const THREE_DIGIT_NUMBER = 3; //입력값 3자리로 제한

//페이지 시작할 때 initializeGame() 호출
document.addEventListener("DOMContentLoaded", () => {
  initializeGame();

  //이벤트 리스너 등록(chat 추가)
  document
    .querySelector("#sendButton")
    ?.addEventListener("click", () => addUserChat());
});

let state = State.StartGame; //시작 상태로 초기화
let computerNumber: number[] = []; //컴퓨터 랜덤값



/* ----- 채팅 ----- */
//✔️알림창 추가
const addAlert = (message: string) => {
  const alert = document.createElement("p");
  alert.classList.add("alert");
  alert.innerText = message;

  const chatBox = document.querySelector("div.chatBox");
  chatBox?.append(alert);
  chatBox?.scrollTo(0, chatBox.scrollHeight);
};

//✔️채팅 추가
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

//✔️사용자 채팅 추가
const addUserChat = () => {
  const inputElement = document.querySelector("input");
  if (!inputElement) return;

  const userInput = inputElement.value.trim();
  if (userInput === "") return;

  addChat("user", userInput);
  inputElement.value = "";

  handleUserInput(userInput);
};



/* ----- 게임 상태 ----- */
const initializeGame = () => { //게임 초기화
  state = State.StartGame;
  addChat("computer", "게임을 새로 시작하려면 1, 종료하려면 9를 입력하세요.");
};

const startGame = (input: string) => { //게임 시작
  if (input === State.StartGame) { //'1'일 경우
    computerNumber = generateComputerNumber(THREE_DIGIT_NUMBER);
    addAlert("컴퓨터가 숫자를 뽑았습니다.");
    addChat("computer", "세자리 숫자를 입력해주세요.");
    state = State.RunningGame;
  } else if (input === State.EndGame) { //'9'일 경우
    endGame();
  }
}

const runningGame = (input: string) => { //게임중
  if (input === State.RunningGame) { //'2'일 경우
    return endGame(); 
  }

  let userNumber = convertUserInput(input);
  if (userNumber === null) {
    return addChat("computer", "잘못된 값을 입력했습니다.");
  }
    
  const isWin = compareNumbers(computerNumber, userNumber); //반환값 true;
  if (isWin) {
    addChat("computer", "3개의 숫자를 모두 맞히셨습니다.");
    addAlert("게임 종료");
    initializeGame();
  }
}

const endGame = () => { //게임 종료
  state = State.EndGame;
  addAlert(
    "애플리케이션이 종료되었습니다.\n게임을 시작하시려면 새로고침 해주세요."
  );
};



/* ----- 게임 ----- */
//✔️게임 흐름 제어
const handleUserInput = (input: string) => {
  if (state === State.StartGame) {
    startGame(input);
  } else if (state === State.RunningGame) {
    runningGame(input);
  }
};

//✔️랜덤 숫자 생성
export const generateComputerNumber = (digitNumber: number): number[] => {
  let shuffledNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  shuffledNumbers.sort(() => Math.random() - 0.5);
  return shuffledNumbers.splice(0, digitNumber);
};

//✔️입력값 체크 후 변환한 값 반환
export const convertUserInput = (input: string): number[] | null => {
  if(!/^[1-9]+$/.test(input)) { //1~9 사이의 정수인지 체크
     return null;
  }
  if(input.length !== THREE_DIGIT_NUMBER) { //3자리인지 체크
    return null;
  }
  const uniqueEntries = new Set(Array.from(input)); //중복값인지 체크
  if(uniqueEntries.size !== THREE_DIGIT_NUMBER) {
    return null;
  }

  return Array.from(input).map(char => Number(char)); //숫자 배열 리턴
}

//✔️스트라이크 가져오기
export const getStrikeCount = (computerNumber: number[], userNumber: number[]): number => {
  return userNumber.filter((number, index) => computerNumber[index] === number).length;
};

//✔️볼 가져오기
export const getBallCount = (computerNumber: number[], userNumber: number[]): number => {
  return userNumber.filter((number, index) => computerNumber[index] !== number && computerNumber.includes(number)).length;
};

//✔️값 비교
export const compareNumbers = (computerNumber: number[], userNumber: number[]) => {
  const strikeCount = getStrikeCount(computerNumber, userNumber);
  const ballCount = getBallCount(computerNumber, userNumber);

  if (strikeCount === 0 && ballCount > 0) {
    addChat("computer", `${ballCount}볼`);
  } else if (strikeCount > 0 && ballCount === 0) {
    addChat("computer", `${strikeCount}스트라이크`);
  } else if (strikeCount > 0 && ballCount > 0) {
    addChat("computer", `${ballCount}볼 ${strikeCount}스트라이크`);
  } else {
    addChat("computer", "낫싱");
  }

  return strikeCount === 3;
};