import { GameStateStore, GameState } from "./types.js";

export const store: GameStateStore = {
  currentState: GameState.StartGame,
  computerNumber: [],
  currentRound: 1,
  roundCount: 0,
  statistics: [],
};
