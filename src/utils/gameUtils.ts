import { useRouter } from 'vue-router'

export function useGameUtils() {
  const router = useRouter()

  const quitGame = (playerDrinks?: Record<string, number>) => {
    if (playerDrinks) {
      router.push({
        path: '/recap',
        query: { playerDrinks: JSON.stringify(playerDrinks) },
      })
    } else {
      router.push('/game-modes') // Redirige vers la page des modes de jeu si aucun paramètre
    }
  }

  return {
    quitGame,
  }
}
