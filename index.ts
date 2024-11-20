type Player = "computer" | "user" | "alert"; // 컴퓨터, 사람 도메인
enum GameState { // 진행 상태 도메인
  StartGame = "1",
  SettingGameRound = "SettingGameRound",
  RunningGame = "2",
  EndGame = "9",
}

interface GameStatistic {
  // 게임 통계 기록
  id: number;
  startTime: Date;
  endTime?: Date;
  roundCount: number;
  tryCount?: number;
  winner?: Player;
  gameLog: GameLog[];
}

interface GameLog {
  sender: Player;
  message: string;
}

interface GameStateStore {
  currentState: GameState; // 현재 진행 상태
  computerNumber: number[]; // 컴퓨터가 뽑은 숫자
  currentRound: number; // 현재 라운드
  roundCount: number; // 게임 횟수
  statistics: GameStatistic[]; // 게임 통계
}

const THREE_DIGIT_NUMBER = 3; // 입력값 3자리로 제한
const SHOW_STATISTICS = "3";

const store: GameStateStore = {
  currentState: GameState.StartGame,
  computerNumber: [],
  currentRound: 1,
  roundCount: 0,
  statistics: [],
};

//페이지 시작할 때 initializeGame() 호출
document.addEventListener("DOMContentLoaded", () => {
  initializeGame();

  //이벤트 리스너 등록(chat 추가)
  document
    .querySelector("#sendButton")
    ?.addEventListener("click", () => addUserChat());
});

/* ----- 채팅 ----- */
//✔️알림창 추가
const addAlert = (message: string) => {
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
const addChat = (sender: Player, message: string) => {
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
const initializeGame = () => {
  //게임 초기화
  store.currentState = GameState.StartGame;
  store.currentRound = 1;
  addChat(
    "computer",
    "게임을 새로 시작하려면 1, 기록을 보려면 2, 통계를 보려면 3, 종료하려면 9을 입력하세요."
  );
};

const startGame = (input: string) => {
  //게임 시작
  if (input === GameState.StartGame) {
    //'1'일 경우
    store.currentState = GameState.SettingGameRound;
    requestSettingRound();
  } else if (input === GameState.EndGame) {
    //'9'일 경우
    endGame();
  } else if (input === SHOW_STATISTICS) {
    console.log(store.statistics);

    console.log("---------------------------");

    showStatistics();
  }
};

const showStatistics = () => {
  const arr = Array.from(store.statistics);
  arr.sort((a, b) => (a.tryCount??0) - (b.tryCount??0));
  const minTryCount = arr[0];
  const maxTryCount = arr[arr.length-1];

  arr.sort((a, b) => a.roundCount - b.roundCount);
  const minRoundCount = arr[0];
  const maxRoundCount = arr[arr.length-1];



  const sumRoundCount = store.statistics.reduce((acc, cur) => {
    return acc + cur.roundCount;
  }, 0);

  const sumTryCount = store.statistics.reduce((acc, cur) => {
    return acc + (cur.tryCount??0);
  }, 0);
  

  const maxFre = calculateFrequency(store.statistics);


  const winComputer = arr.filter((e) => e.winner === 'computer');
  const computerFre = calculateFrequency(winComputer);
  const winUser = arr.filter((e) => e.winner === 'user');
  const userFre = calculateFrequency(winUser);



  console.log(`가장 적은 횟수 : ${minTryCount.tryCount} - [${minTryCount.id}]`); //가장 적은 횟수 
  console.log(`가장 많은 횟수 : ${maxTryCount.tryCount} - [${maxTryCount.id}]`); //가장 많은 횟수
  console.log(`가장 많이 적용된 라운드 횟수 : ${maxFre[0]} - [${maxFre[1]}]`); //가장 많이 적용된 라운드 횟수
  console.log(`가장 큰 값으로 적용된 라운드 횟수 : ${maxRoundCount.roundCount} - [${maxRoundCount.id}]`); //가장 큰 값으로 적용된 라운드 횟수
  console.log(`가장 작은 값으로 적용된 라운드 횟수 : ${minRoundCount.roundCount} - [${minRoundCount.id}]`); //가장 적은 값으로 적용된 라운드 횟수
  console.log(`적용된 라운드 횟수 평균 : ${sumRoundCount/store.statistics.length}`) //적용된 라운드 횟수 평균(총 라운드 횟수 / 게임 진행 횟수)
  console.log(`평균 라운드 횟수 평균 : ${(sumTryCount/store.statistics.length).toFixed(2)}`) //평균 라운드 횟수(유저 입력 횟수 / 게임 진행 횟수)
  console.log(`컴퓨터가 가장 많이 승리한 라운드 횟수 : ${computerFre[0]} - [${computerFre[1]}]`); //컴퓨터가 가장 많이 승리한 라운드 횟수
  console.log(`사용자가 가장 많이 승리한 라운드 횟수 : ${userFre[0]} - [${userFre[1]}]`) //사용자가 가장 많이 승리한 라운드 횟수
}

const calculateFrequency = (arr: GameStatistic[]) => {
  const frequency = new Map<number, number>(); //키: 라운드, 값: 등장 횟수 => 높은 값 갖고 있는 키 리턴
  
  arr.map((e) => {
    frequency.set(e.roundCount, (frequency.get(e.roundCount) ?? 0)+1); 
  });

  const maxFre =  Math.max(...frequency.values());
  const findKey = Array.from(frequency.keys()).filter(e => frequency.get(e) === maxFre);
  
  const findMaxFre = arr.filter(e => findKey.includes(e.roundCount)).map(e => e.id);

  return [findKey, findMaxFre];
}

const requestSettingRound = () => {
  store.currentState = GameState.SettingGameRound;
  addChat("computer", "게임 라운드 횟수를 설정해주세요.");
};

const settingGameRound = (input: string) => {
  if (!/^[1-9]\d*$/.test(input)) {
    // 정수인지 체크
    addChat("computer", "잘못된 값을 입력했습니다.");
    return;
  }
  store.roundCount = Number(input);

  store.statistics.push({
    id: store.statistics.length + 1,
    startTime: new Date(),
    roundCount: store.roundCount,
    gameLog: [],
  });

  addAlert(`${store.currentRound} / ${store.roundCount} 라운드`);

  store.currentState = GameState.RunningGame;
  store.computerNumber = generateComputerNumber(THREE_DIGIT_NUMBER);
  addAlert("컴퓨터가 숫자를 뽑았습니다.");
  addChat("computer", "세자리 숫자를 입력해주세요.");
};

const runningGame = (input: string) => {
  //게임중
  if (input === GameState.RunningGame) {
    //'2'일 경우
    return endGame();
  }

  const userNumber = convertUserInput(input);
  if (userNumber === null) {
    return addChat("computer", "잘못된 값을 입력했습니다.");
  }

  const isWin = compareNumbers(store.computerNumber, userNumber); //반환값 true;
  if (isWin) {
    addChat("computer", "3개의 숫자를 모두 맞히셨습니다.");
    addAlert("사용자 승리");
    finalizeStatistics("user");
    return initializeGame();
  }

  if (store.currentRound >= store.roundCount) {
    addAlert(
      `컴퓨터 승리\n정답은 ${store.computerNumber.join("")} 이었습니다.`
    );
    finalizeStatistics("computer");
    return initializeGame();
  }
  store.currentRound += 1;
  addAlert(`${store.currentRound} / ${store.roundCount} 라운드`);
};

const finalizeStatistics = (winner: Player) => {
  let lastElement = store.statistics.at(-1);
  if (!lastElement) return;
  lastElement = {
    ...lastElement,
    endTime: new Date(),
    tryCount: store.currentRound,
    winner,
  };
  store.statistics[store.statistics.length - 1] = lastElement;
};

const endGame = () => {
  //게임 종료
  store.currentState = GameState.EndGame;
  addAlert(
    "애플리케이션이 종료되었습니다.\n게임을 시작하시려면 새로고침 해주세요."
  );
};

/* ----- 게임 ----- */
//✔️게임 흐름 제어
const handleUserInput = (input: string) => {
  if (store.currentState === GameState.StartGame) {
    startGame(input);
  } else if (store.currentState === GameState.SettingGameRound) {
    settingGameRound(input);
  } else if (store.currentState === GameState.RunningGame) {
    runningGame(input);
  }
};

//✔️랜덤 숫자 생성
export const generateComputerNumber = (digitNumber: number): number[] => {
  const shuffledNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  shuffledNumbers.sort(() => Math.random() - 0.5);
  return shuffledNumbers.splice(0, digitNumber);
};

//✔️입력값 체크 후 변환한 값 반환
export const convertUserInput = (input: string): number[] | null => {
  if (!/^[1-9]+$/.test(input)) {
    //1~9 사이의 정수인지 체크
    return null;
  }
  if (input.length !== THREE_DIGIT_NUMBER) {
    //3자리인지 체크
    return null;
  }
  const uniqueEntries = new Set(Array.from(input)); //중복값인지 체크
  if (uniqueEntries.size !== THREE_DIGIT_NUMBER) {
    return null;
  }

  return Array.from(input).map((char) => Number(char)); //숫자 배열 리턴
};

//✔️스트라이크 가져오기
export const getStrikeCount = (
  computerNumber: number[],
  userNumber: number[]
): number => {
  return userNumber.filter((number, index) => computerNumber[index] === number)
    .length;
};

//✔️볼 가져오기
export const getBallCount = (
  computerNumber: number[],
  userNumber: number[]
): number => {
  return userNumber.filter(
    (number, index) =>
      computerNumber[index] !== number && computerNumber.includes(number)
  ).length;
};

//✔️값 비교
export const compareNumbers = (
  computerNumber: number[],
  userNumber: number[]
) => {
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
