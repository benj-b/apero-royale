<template>
  <div class="outer-container">
    <div class="container">
      <h1 class="question">
        {{ currentPlayer }}, tu préfères {{ currentQuestion.choix1 }} ou
        {{ currentQuestion.choix2 }} ?
      </h1>
      <div class="buttons">
        <button class="choice-button" @click="chooseOption(choice1)">
          {{ currentQuestion.choix1 }}
        </button>
        <button class="choice-button" @click="chooseOption(choice2)">
          {{ currentQuestion.choix2 }}
        </button>
      </div>
      <button class="drink-button" @click="drink">
        Je bois {{ currentQuestion.drinks }} gorgées !
      </button>
      <p class="round-info">Round {{ currentRound }} / {{ totalRounds }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import tupreferes_soft from '@/assets/tupreferes_soft.json'
import tupreferes_hot from '@/assets/tupreferes_hot.json'
import { useGameStore } from '@/stores/useGameStore'

export default defineComponent({
  name: 'TuPreferes',
  setup() {
    const gameStore = useGameStore()
    const router = useRouter()

    // Récupérer les paramètres de la route
    const players = ref(gameStore.players)
    const totalRounds = ref(gameStore.rounds)
    const difficulty = ref(gameStore.difficulty)

    const questions = difficulty.value === 'soft' ? tupreferes_soft : tupreferes_hot

    const currentRound = ref(1) // Initialiser le round actuel à 1
    const currentPlayerIndex = ref(0) // Index du joueur actuel
    const currentQuestion = ref({
      choix1: '',
      choix2: '',
      drinks: 0,
      difficulty: '',
    })

    const currentPlayer = ref('')
    const playerDrinks = ref<Record<string, number>>({})

    const loadQuestion = () => {
      const randomIndex = Math.floor(Math.random() * questions.length)
      currentQuestion.value = questions[randomIndex]
    }

    const nextTurn = () => {
      if (currentPlayerIndex.value < players.value.length - 1) {
        currentPlayerIndex.value++
      } else {
        currentPlayerIndex.value = 0
        currentRound.value++
      }

      if (currentRound.value > totalRounds.value) {
        router.push({
          path: '/recap',
          query: { playerDrinks: JSON.stringify(playerDrinks.value) },
        })
      } else {
        currentPlayer.value = players.value[currentPlayerIndex.value]
        loadQuestion()
      }
    }

    const chooseOption = () => {
      nextTurn()
    }

    const drink = () => {
      playerDrinks.value[currentPlayer.value] =
        (playerDrinks.value[currentPlayer.value] || 0) + currentQuestion.value.drinks
      nextTurn()
    }

    onMounted(() => {
      if (players.value.length === 0) {
        alert("Aucun joueur n'est sélectionné.")
        router.push('/')
      } else {
        players.value.forEach((player) => {
          playerDrinks.value[player] = 0
        })
        currentPlayer.value = players.value[currentPlayerIndex.value]
        loadQuestion()
      }
    })

    return {
      players,
      currentPlayer,
      currentQuestion,
      currentRound,
      totalRounds,
      difficulty,
      playerDrinks,
      chooseOption,
      drink,
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

.question {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #ffeb3b;
}

.buttons {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1.5rem;
}

.choice-button {
  background-color: #4caf50;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
  border: none;
}

.choice-button:hover {
  background-color: #66bb6a;
  transform: scale(1.05);
}

.drink-button {
  background-color: #f44336;
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

.drink-button:hover {
  background-color: #e57373;
  transform: scale(1.05);
}
</style>
