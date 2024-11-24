import { addAlert, addChat } from "./chat.js";
import { initializeGame } from "./index.js";
import { store } from "./store.js";
import { Player, GameStatistic } from "./types.js";

export const showStatistics = () => {
  if (store.statistics.length === 0) {
    addChat("computer", "표시할 통계가 없습니다.");
    return initializeGame();
  }

  const [minTryCount, maxTryCount] = calculateTryCount();
  const [minRoundCount, maxRoundCount] = calculateRoundCount();
  const sumRoundCount = store.statistics.reduce((acc, cur) => acc + cur.roundCount, 0);
  const sumTryCount = store.statistics.reduce((acc, cur) => acc + (cur.tryCount ?? 0), 0);
  const [maxRoundFrequency, maxRoundFrequencyIds] = calculateFrequency(store.statistics);

  const winComputer = store.statistics.filter((e) => e.winner === "computer");
  const [computerFrequency] = calculateFrequency(winComputer);
  const winUser = store.statistics.filter((e) => e.winner === "user");
  const [userFrequency] = calculateFrequency(winUser);

  createStatisticsMessage(minTryCount, maxTryCount, minRoundCount, maxRoundCount, sumRoundCount, 
                          sumTryCount, maxRoundFrequency, maxRoundFrequencyIds, computerFrequency, userFrequency);
  initializeGame();
};

const calculateTryCount = () => {
  const statisticsCopy = Array.from(store.statistics);

  statisticsCopy.sort((a, b) => (a.tryCount ?? 0) - (b.tryCount ?? 0));
  const minTryCount = statisticsCopy[0];
  const maxTryCount = statisticsCopy[statisticsCopy.length - 1];

  return [minTryCount, maxTryCount];
}

const calculateRoundCount = () => {   
  const statisticsCopy = Array.from(store.statistics);

  statisticsCopy.sort((a, b) => a.roundCount - b.roundCount);
  const minRoundCount = statisticsCopy[0];
  const maxRoundCount = statisticsCopy[statisticsCopy.length - 1];

  return [minRoundCount, maxRoundCount];
}

const calculateFrequency = (statistics: GameStatistic[]) => {
  const frequency = new Map<number, number>();

  statistics.map((e) => {
    frequency.set(e.roundCount, (frequency.get(e.roundCount) ?? 0) + 1);
  });

  const maxFrequency = Math.max(...frequency.values());
  const roundCount = Array.from(frequency.keys()).filter(
    (e) => frequency.get(e) === maxFrequency
  );

  const gameIds = statistics
    .filter((e) => roundCount.includes(e.roundCount))
    .map((e) => e.id);

  return [roundCount, gameIds];
};

const createStatisticsMessage = (minTryCount: GameStatistic, maxTryCount: GameStatistic, minRoundCount: GameStatistic, maxRoundCount: GameStatistic, sumRoundCount: number, 
                                sumTryCount: number, maxRoundFrequency: number[], maxRoundFrequencyIds: number[], computerFrequency: number[], userFrequency: number[]) => {
  let message = `가장 적은 횟수 : ${minTryCount.tryCount} - [${minTryCount.id}]\n`;
  message += `가장 많은 횟수 : ${maxTryCount.tryCount} - [${maxTryCount.id}]\n`;
  message += `가장 많이 적용된 라운드 횟수 : ${maxRoundFrequency} - [${maxRoundFrequencyIds}]\n`;
  message += `가장 큰 값으로 적용된 라운드 횟수 : ${maxRoundCount.roundCount} - [${maxRoundCount.id}]\n`;
  message += `가장 작은 값으로 적용된 라운드 횟수 : ${minRoundCount.roundCount} - [${minRoundCount.id}]\n`;
  message += `적용된 라운드 횟수 평균 : ${sumRoundCount / store.statistics.length}\n`;
  message += `평균 라운드 횟수 평균 : ${(sumTryCount / store.statistics.length).toFixed(2)}\n`;
  message += `컴퓨터가 가장 많이 승리한 라운드 횟수 : ${computerFrequency.join(", ") || 0}\n`;
  message += `사용자가 가장 많이 승리한 라운드 횟수 : ${userFrequency.join(", ") || 0}`;

  addAlert(message);
}

export const finalizeStatistics = (winner: Player) => {
  let lastElement = store.statistics.at(-1); 

  if (!lastElement) return;

  lastElement = {
    ...lastElement,
    endTime: new Date(),
    tryCount: store.currentRound,
    winner
  };

  store.statistics[store.statistics.length - 1] = lastElement;
};