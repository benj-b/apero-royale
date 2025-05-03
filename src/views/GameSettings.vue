<template>
  <div class="outer-container">
    <div class="container">
      <h1 class="title">Paramètres de la partie</h1>
      <h2 class="game-name">{{ gameName }}</h2>
      <div class="settings">
        <div class="setting">
          <p class="label">Difficulté :</p>
          <div class="difficulty-cards">
            <div
              class="difficulty-card"
              :class="{ selected: difficulty === 'soft' }"
              @click="difficulty = 'soft'"
            >
              <p class="emoji">😊</p>
              <p class="difficulty-title">Mode Soft</p>
            </div>
            <div
              class="difficulty-card"
              :class="{ selected: difficulty === 'hot' }"
              @click="difficulty = 'hot'"
            >
              <p class="emoji">😈</p>
              <p class="difficulty-title">Mode Hot</p>
              <p class="difficulty-description">À éviter en famille !</p>
            </div>
          </div>
        </div>

        <div class="setting">
          <label for="rounds" class="label">Nombre de rounds :</label>
          <input
            v-model="rounds"
            id="rounds"
            type="range"
            :min="25"
            :max="100"
            :step="25"
            class="slider"
          />
          <p class="slider-value">{{ rounds }} rounds</p>
        </div>
      </div>

      <button @click="startGame" class="start-button">Lancer la partie</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGameStore } from '@/stores/useGameStore'

export default defineComponent({
  name: 'GameSettings',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const gameStore = useGameStore()

    // Récupérer le nom du jeu depuis les paramètres de la route
    const gameName = ref(route.query.gameName || 'Jeu inconnu')
    const difficulty = ref('soft') // Valeur par défaut
    const rounds = ref(25) // Valeur par défaut

    const startGame = () => {
      // Redirection vers la vue du jeu avec les paramètres
      gameStore.setDifficulty(difficulty.value)
      gameStore.setRounds(rounds.value)
      router.push({
        path: '/' + gameName.value,
      })
    }

    return {
      gameName,
      difficulty,
      rounds,
      startGame,
    }
  },
})
</script>

<style scoped>
.game-name {
  font-size: 1.8rem;
  font-weight: bold;
  color: #ffeb3b;
  margin-bottom: 2rem;
}

.settings {
  margin-bottom: 2rem;
}

.setting {
  margin-bottom: 1.5rem;
}

.label {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #ffeb3b;
}

.difficulty-cards {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

.difficulty-card {
  background: rgba(255, 255, 255, 0.2);
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
  width: 45%;
}

.difficulty-card:hover {
  transform: scale(1.05);
}

.difficulty-card.selected {
  background: rgba(255, 255, 255, 0.4);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
}

.emoji {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.difficulty-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #ffeb3b;
}

.difficulty-description {
  font-size: 0.9rem;
  color: #f8bbd0;
  margin-top: 0.5rem;
}

.slider {
  width: 100%;
  margin: 1rem 0;
}

.slider-value {
  font-size: 1.2rem;
  color: #f8bbd0;
}

.start-button {
  background-color: #4caf50;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 1.5rem;
  font-weight: bold;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
}

.start-button:hover {
  background-color: #66bb6a;
  transform: scale(1.05);
}
</style>
