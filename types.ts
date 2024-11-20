export type Player = "computer" | "user" | "alert"; // 컴퓨터, 사람 도메인
export enum GameState { // 진행 상태 도메인
  StartGame = "1",
  SettingGameRound = "SettingGameRound",
  RunningGame = "2",
  EndGame = "9",
}

export interface GameStatistic {
  // 게임 통계 기록
  id: number;
  startTime: Date;
  endTime?: Date;
  roundCount: number;
  tryCount?: number;
  winner?: Player;
  gameLog: GameLog[];
}

export interface GameLog {
  sender: Player;
  message: string;
}

export interface GameStateStore {
  currentState: GameState; // 현재 진행 상태
  computerNumber: number[]; // 컴퓨터가 뽑은 숫자
  currentRound: number; // 현재 라운드
  roundCount: number; // 게임 횟수
  statistics: GameStatistic[]; // 게임 통계
}
