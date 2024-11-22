import { addAlert, addChat } from "./chat.js";
import { initializeGame } from "./index.js";
import { store } from "./store.js";
import { GameState } from "./types.js";
import { formatDate } from "./util.js";

export const showLog = () => {
  if (store.statistics.length === 0) {
    addChat("computer", "기록된 게임이 없습니다.");
    return;
  }

  store.currentState = GameState.ShowLog;

  store.statistics.map((stat) => {
    let winner = "";
    if (stat.winner === "computer") {
      winner = "컴퓨터";
    } else if (stat.winner === "user") {
      winner = "사용자";
    }
    addChat(
      "computer",
      `- [${stat.id}] / 시작시간: ${formatDate(
        stat.startTime
      )} / 종료시간: ${formatDate(stat.endTime)} / 횟수: ${
        stat.roundCount
      } / 승리자: ${winner}`
    );
  });
};

export const handleShowLog = (id: string) => {
  // id validation
  const statistics = store.statistics.find((stat) => stat.id === parseInt(id));

  if (!statistics) {
    addChat("computer", "존재하지 않는 게임입니다.");
    return;
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
