export type BallNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export type Player = "computer" | "user" | "alert";

export enum GameState {
  StartGame = "1",
  SettingGameRound = "SettingGameRound",
  ShowLog = "ShowLog",
  RunningGame = "2",
  EndGame = "9",
}

export interface GameStatistic {
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
  currentState: GameState;
  computerNumber: number[];
  currentRound: number;
  roundCount: number;
  statistics: GameStatistic[];
}
