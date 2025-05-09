<template>
  <div class="outer-container">
    <div class="container">
      <h1 class="question">
        {{ currentPlayer }}, tu préfères {{ currentQuestion.choix1 }} ou
        {{ currentQuestion.choix2 }} ?
      </h1>
      <div class="buttons">
        <button class="choice-button" @click="chooseOption">
          {{ currentQuestion.choix1 }}
        </button>
        <button class="choice-button" @click="chooseOption">
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
      difficulty: '',
      drinks: 0,
    })

    const currentPlayer = ref('')
    const playerDrinks = ref<Record<string, number>>({})
    const usedIndices = ref(new Set<number>()) // Ensemble des indices déjà utilisés

    const loadQuestion = () => {
      if (usedIndices.value.size >= questions.length) {
        usedIndices.value.clear() // Réinitialiser si toutes les questions ont été posées
      }

      let randomIndex
      do {
        randomIndex = Math.floor(Math.random() * questions.length)
        console.log('randomIndex', randomIndex)
      } while (usedIndices.value.has(randomIndex))

      console.log('usedIndices', usedIndices.value)
      usedIndices.value.add(randomIndex)
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
