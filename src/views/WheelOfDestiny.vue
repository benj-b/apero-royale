<template>
  <div class="outer-container">
    <div class="container">
      <h1 class="title">La Roue du Destin</h1>
      <div class="roulette-container">
        <div v-if="!isSpinning" class="roulette">
          <h2>Action : {{ selectedAction }}</h2>
          <button class="spin-button" @click="spinActionWheel">Lancer la roue des actions</button>
        </div>
        <div v-if="isSpinning" class="roulette spinning">
          <p>La roue tourne...</p>
        </div>
      </div>

      <div v-if="selectedAction && !isPlayerSpinning" class="roulette-container">
        <h2>Joueur : {{ selectedPlayer }}</h2>
        <button class="spin-button" @click="spinPlayerWheel">Lancer la roue des joueurs</button>
      </div>

      <div v-if="isPlayerSpinning" class="roulette spinning">
        <p>La roue des joueurs tourne...</p>
      </div>

      <button class="quit-button" @click="handleQuitGame">Quitter le jeu</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useGameUtils } from '@/utils/gameUtils'
import { useGameStore } from '@/stores/useGameStore'

export default defineComponent({
  name: 'WheelOfDestiny',
  setup() {
    const gameStore = useGameStore()
    const { quitGame } = useGameUtils()

    const actions = [
      'Boire 2 gorgées',
      'Donne 3 gorgées',
      'Vérité : Réponds à une question',
      'Défi : Fais un tour sur toi-même',
      'Tous : Tout le monde boit sauf toi',
    ]

    const players = ref(gameStore.players)
    // -----------------------------------------
    // -------------------- TODO ---------------
    // -----------------------------------------
    /* dans la vue reacp on rajoute 2 boutons,
        1. pour changer de jeu (qui fait revenir a /game-modes)
        2. pour revenir au menu principal et changer la liste des joueurs (qui fait revenir a /)
    */

    const selectedAction = ref('')
    const selectedPlayer = ref('')
    const isSpinning = ref(false)
    const isPlayerSpinning = ref(false)

    const spinActionWheel = () => {
      isSpinning.value = true
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * actions.length)
        selectedAction.value = actions[randomIndex]
        isSpinning.value = false
      }, 2000) // Durée de l'animation
    }

    const spinPlayerWheel = () => {
      isPlayerSpinning.value = true
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * players.value.length)
        selectedPlayer.value = players.value[randomIndex]
        isPlayerSpinning.value = false
      }, 2000) // Durée de l'animation
    }

    const handleQuitGame = () => {
      quitGame()
    }

    return {
      actions,
      players,
      selectedAction,
      selectedPlayer,
      isSpinning,
      isPlayerSpinning,
      spinActionWheel,
      spinPlayerWheel,
      handleQuitGame,
    }
  },
})
</script>

<style scoped>
.outer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to bottom, #6a1b9a, #ec407a);
  padding: 1rem;
}

.container {
  max-width: 600px;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
  border-radius: 1rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #ffeb3b;
}

.roulette-container {
  margin: 2rem 0;
}

.roulette {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffeb3b;
}

.roulette.spinning {
  font-size: 1.2rem;
  color: #f8bbd0;
}

.spin-button {
  background-color: #4caf50;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
  border: none;
}

.spin-button:hover {
  background-color: #66bb6a;
  transform: scale(1.05);
}
</style>
