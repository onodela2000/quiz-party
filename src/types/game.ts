export type GamePhase = 'waiting' | 'question' | 'reveal' | 'result'

export type GameState = {
  phase: GamePhase
  currentQuizIndex: number
}
