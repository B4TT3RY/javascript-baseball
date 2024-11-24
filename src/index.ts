import { addUserChat, addChat, addAlert } from "./chat.js";
import { SHOW_LOG, SHOW_STATISTICS, THREE_DIGIT_NUMBER } from "./const.js";
import { handleShowLog, showLog } from "./log.js";
import { store } from "./store.js";
import { GameState } from "./types.js";
import { showStatistics, finalizeStatistics } from "./statistics.js";
import {
  generateComputerNumber,
  getBallCount,
  getStrikeCount,
} from "./util.js";

document.addEventListener("DOMContentLoaded", () => {
  initializeGame();

  document
    .querySelector("#sendButton")
    ?.addEventListener("click", () => addUserChat());
});

export const initializeGame = () => {
  store.currentState = GameState.StartGame;
  store.currentRound = 1;
  addChat(
    "computer",
    "게임을 새로 시작하려면 1, 기록을 보려면 2, 통계를 보려면 3, 종료하려면 9을 입력하세요."
  );
};

const handleStartGame = (input: string) => {
  if (input === GameState.StartGame) {
    store.currentState = GameState.SettingGameRound;
    requestSettingRound();
  } else if (input === GameState.EndGame) {
    endGame();
  } else if (input === SHOW_LOG) {
    showLog();
  } else if (input === SHOW_STATISTICS) {
    showStatistics();
  }
};

const requestSettingRound = () => {
  store.currentState = GameState.SettingGameRound;
  addChat("computer", "게임 라운드 횟수를 설정해주세요.");
};

const handleSettingGameRound = (input: string) => {
  if (!/^[1-9]\d*$/.test(input)) {
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

const handleRunningGame = (input: string) => {
  if (input === GameState.RunningGame) {
    return endGame();
  }

  const userNumber = convertUserInput(input);
  if (userNumber === null) {
    return addChat("computer", "잘못된 값을 입력했습니다.");
  }

  const isWin = compareNumbers(store.computerNumber, userNumber);
  if (isWin) {
    return handleUserWin();
  }

  if (store.currentRound >= store.roundCount) {
    return handleComputerWin();
  }
  store.currentRound += 1;
  addAlert(`${store.currentRound} / ${store.roundCount} 라운드`);
};

const handleUserWin = () => {
  addChat("computer", "3개의 숫자를 모두 맞히셨습니다.");
  addAlert("사용자 승리");
  finalizeStatistics("user");
  initializeGame();
}

const handleComputerWin = () => {
  addAlert(`컴퓨터 승리\n정답은 ${store.computerNumber.join("")} 이었습니다.`);
    finalizeStatistics("computer");
    initializeGame();
}

const endGame = () => {
  store.currentState = GameState.EndGame;
  addAlert(
    "애플리케이션이 종료되었습니다.\n게임을 시작하시려면 새로고침 해주세요."
  );
};

export const showNonExistsGame = () => {
  addChat("computer", "존재하지 않는 게임입니다.");
  initializeGame();
};

export const handleUserInput = (input: string) => {
  if (store.currentState === GameState.StartGame) {
    handleStartGame(input);
  } else if (store.currentState === GameState.SettingGameRound) {
    handleSettingGameRound(input);
  } else if (store.currentState === GameState.RunningGame) {
    handleRunningGame(input);
  } else if (store.currentState === GameState.ShowLog) {
    handleShowLog(input);
  }
};

export const convertUserInput = (input: string): number[] | null => {
  if (!/^[1-9]+$/.test(input)) {
    return null;
  }
  if (input.length !== THREE_DIGIT_NUMBER) {
    return null;
  }
  const uniqueEntries = new Set(Array.from(input));
  if (uniqueEntries.size !== THREE_DIGIT_NUMBER) {
    return null;
  }

  return Array.from(input).map((char) => Number(char));
};

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
