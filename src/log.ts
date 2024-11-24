import { addAlert, addChat } from "./chat.js";
import { initializeGame, showNonExistsGame } from "./index.js";
import { store } from "./store.js";
import { GameState } from "./types.js";
import { formatDate } from "./util.js";

export const showLog = () => {
  if (store.statistics.length === 0) {
    return showNonExistsGame();
  }

  store.currentState = GameState.ShowLog;

  store.statistics.map((stat) => {
    let winner = "";
    if (stat.winner === "computer") {
      winner = "컴퓨터";
    } else if (stat.winner === "user") {
      winner = "사용자";
    }
    addChat("computer", `- [${stat.id}] / 시작시간: ${formatDate(stat.startTime)} / 종료시간: ${formatDate(stat.endTime)} / 횟수: ${stat.roundCount} / 승리자: ${winner}`);
  });
};

export const handleShowLog = (id: string) => {
  const statistics = store.statistics.find((stat) => stat.id === parseInt(id));

  if (!statistics) {
    return showNonExistsGame();
  }

  addAlert(`${statistics.id}번 게임 기록 시작`);

  statistics.gameLog.map((log) => {
    if (log.sender === "alert") {
      addAlert(log.message);
    } else {
      addChat(log.sender, log.message);
    }
  });

  addAlert(`${statistics.id}번 게임 기록 종료`);
  initializeGame();
};