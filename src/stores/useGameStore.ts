import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', {
  state: () => ({
    players: [] as string[],
    rounds: 0,
    difficulty: 'soft',
  }),
  actions: {
    setPlayers(players: string[]) {
      this.players = players
    },
    setRounds(rounds: number) {
      this.rounds = rounds
    },
    setDifficulty(difficulty: string) {
      this.difficulty = difficulty
    },
  },
})
