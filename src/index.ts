import { addUserChat, addChat, addAlert } from "./chat.js";
import { SHOW_LOG, SHOW_STATISTICS, THREE_DIGIT_NUMBER } from "./const.js";
import { handleShowLog, showLog } from "./log.js";
import { store } from "./store.js";
import { GameState, Player, GameStatistic } from "./types.js";
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

const showStatistics = () => {
  if (store.statistics.length === 0) {
    addChat("computer", "표시할 통계가 없습니다.");
    return;
  }

  const arr = Array.from(store.statistics);

  arr.sort((a, b) => (a.tryCount ?? 0) - (b.tryCount ?? 0));
  const minTryCount = arr[0];
  const maxTryCount = arr[arr.length - 1];

  arr.sort((a, b) => a.roundCount - b.roundCount);
  const minRoundCount = arr[0];
  const maxRoundCount = arr[arr.length - 1];

  const sumRoundCount = store.statistics.reduce(
    (acc, cur) => acc + cur.roundCount,
    0
  );

  const sumTryCount = store.statistics.reduce(
    (acc, cur) => acc + (cur.tryCount ?? 0),
    0
  );

  const maxFre = calculateFrequency(store.statistics);

  const winComputer = arr.filter((e) => e.winner === "computer");
  const computerFre = calculateFrequency(winComputer);
  const winUser = arr.filter((e) => e.winner === "user");
  const userFre = calculateFrequency(winUser);

  let message = `가장 적은 횟수 : ${minTryCount.tryCount} - [${minTryCount.id}]\n`;
  message += `가장 많은 횟수 : ${maxTryCount.tryCount} - [${maxTryCount.id}]\n`;
  message += `가장 많이 적용된 라운드 횟수 : ${maxFre[0]} - [${maxFre[1]}]\n`;
  message += `가장 큰 값으로 적용된 라운드 횟수 : ${maxRoundCount.roundCount} - [${maxRoundCount.id}]\n`;
  message += `가장 작은 값으로 적용된 라운드 횟수 : ${minRoundCount.roundCount} - [${minRoundCount.id}]\n`;
  message += `적용된 라운드 횟수 평균 : ${
    sumRoundCount / store.statistics.length
  }\n`;
  message += `평균 라운드 횟수 평균 : ${(
    sumTryCount / store.statistics.length
  ).toFixed(2)}\n`;
  message += `컴퓨터가 가장 많이 승리한 라운드 횟수 : ${
    computerFre[0].join(", ") || 0
  }\n`;
  message += `사용자가 가장 많이 승리한 라운드 횟수 : ${
    userFre[0].join(", ") || 0
  }`;

  addAlert(message);
};

const calculateFrequency = (arr: GameStatistic[]) => {
  const frequency = new Map<number, number>();

  arr.map((e) => {
    frequency.set(e.roundCount, (frequency.get(e.roundCount) ?? 0) + 1);
  });

  const maxFre = Math.max(...frequency.values());
  const findKey = Array.from(frequency.keys()).filter(
    (e) => frequency.get(e) === maxFre
  );

  const findMaxFre = arr
    .filter((e) => findKey.includes(e.roundCount))
    .map((e) => e.id);

  return [findKey, findMaxFre];
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
    addChat("computer", "3개의 숫자를 모두 맞히셨습니다.");
    addAlert("사용자 승리");
    finalizeStatistics("user");
    return initializeGame();
  }

  if (store.currentRound >= store.roundCount) {
    addAlert(`컴퓨터 승리\n정답은 ${store.computerNumber.join("")} 이었습니다.`);
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
  store.currentState = GameState.EndGame;
  addAlert(
    "애플리케이션이 종료되었습니다.\n게임을 시작하시려면 새로고침 해주세요."
  );
};

export const showNonExistsGame = () => {
  addChat("computer", "존재하지 않는 게임입니다.");
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
