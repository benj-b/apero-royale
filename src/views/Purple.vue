<template>
  <div class="outer-container">
    <div class="container">
      <h1 class="title">Purple</h1>
      <h2 class="question">{{ currentPlayer }}, fais ton pari !</h2>
      <p v-if="betResult !== null" :class="['bet-result', betResult ? 'success' : 'failure']">
        {{ betResult ? 'Ça passe !' : 'Raté...' }}
      </p>
      <div class="pile">
        <p class="pile-info">Cartes sur le tas : {{ pile.length }}</p>
        <div class="cards-container">
          <div class="cards-row" v-for="(row, rowIndex) in groupedPile" :key="rowIndex">
            <Card
              v-for="(card, cardIndex) in row"
              :key="cardIndex"
              :value="card.value"
              :color="card.color"
            />
          </div>
        </div>
      </div>
      <div class="buttons">
        <button class="choice-button" @click="makeBet('noir')">Noir</button>
        <button class="choice-button" @click="makeBet('rouge')">Rouge</button>
        <button class="choice-button" @click="makeBet('plus')">Plus</button>
        <button class="choice-button" @click="makeBet('moins')">Moins</button>
        <button class="choice-button" @click="makeBet('interieur')">Intérieur</button>
        <button class="choice-button" @click="makeBet('exterieur')">Extérieur</button>
        <button class="choice-button" @click="makeBet('purple')">Purple</button>
      </div>
      <button
        class="end-turn-button"
        :disabled="pile.length < 3 || isBetInProgress"
        @click="endTurn"
      >
        Terminer le tour
      </button>
      <button class="quit-button" @click="quitGame">Quitter le jeu</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/useGameStore'
import Card from '@/components/Card.vue'

export default defineComponent({
  name: 'PurpleView',
  components: {
    Card,
  },
  setup() {
    const gameStore = useGameStore()
    const router = useRouter()

    // Récupérer les joueurs
    const players = ref(gameStore.players)

    // État du jeu
    const currentPlayerIndex = ref(0)
    const currentPlayer = ref('')
    const pile = ref<{ value: number; color: string }[]>([]) // Tas de cartes
    const playerDrinks = ref<Record<string, number>>({}) // Gorgées par joueur
    const isBetInProgress = ref(false) // Indicateur de pari en cours

    const groupedPile = computed(() => {
      const groups = []
      for (let i = 0; i < pile.value.length; i += 5) {
        groups.push(pile.value.slice(i, i + 5))
      }
      return groups
    })

    // Résultat du pari
    const betResult = ref<null | boolean>(null)

    // Générer une carte aléatoire
    const generateCard = () => {
      const value = Math.floor(Math.random() * 13) + 1 // Valeurs de 1 à 13
      const color = Math.random() < 0.5 ? 'noir' : 'rouge' // Couleur aléatoire
      return { value, color }
    }

    // Charger une nouvelle carte
    const drawCard = () => {
      return generateCard()
    }

    // Vérifier le pari
    const checkBet = (bet: string, newCard: { value: number; color: string }) => {
      const lastCard = pile.value[pile.value.length - 2] // La carte précédente (avant la nouvelle carte)
      const secondLastCard = pile.value[pile.value.length - 3] // La carte avant la précédente

      switch (bet) {
        case 'noir':
          return newCard.color === 'noir'
        case 'rouge':
          return newCard.color === 'rouge'
        case 'plus':
          return lastCard && newCard.value > lastCard.value
        case 'moins':
          return lastCard && newCard.value < lastCard.value
        case 'interieur':
          return (
            secondLastCard &&
            lastCard &&
            newCard.value > Math.min(lastCard.value, secondLastCard.value) &&
            newCard.value < Math.max(lastCard.value, secondLastCard.value)
          )
        case 'exterieur':
          return (
            secondLastCard &&
            lastCard &&
            (newCard.value < Math.min(lastCard.value, secondLastCard.value) ||
              newCard.value > Math.max(lastCard.value, secondLastCard.value))
          )
        default:
          return false
      }
    }

    // Faire un pari
    const makeBet = (bet: string) => {
      isBetInProgress.value = true // Un pari est en cours

      if (bet === 'purple') {
        const firstCard = drawCard()
        const secondCard = drawCard()
        pile.value.push(firstCard, secondCard)

        if (firstCard.color !== secondCard.color) {
          betResult.value = true // Pari réussi
          isBetInProgress.value = false // Pari terminé
        } else {
          betResult.value = false // Pari raté
          const penalty = pile.value.length
          playerDrinks.value[currentPlayer.value] =
            (playerDrinks.value[currentPlayer.value] || 0) + penalty

          setTimeout(() => {
            pile.value = []
            betResult.value = null
            isBetInProgress.value = false // Pari terminé après le délai
          }, 2000)
        }
        return
      }

      const newCard = drawCard()
      pile.value.push(newCard)

      if (checkBet(bet, newCard)) {
        betResult.value = true // Pari réussi
        isBetInProgress.value = false // Pari terminé
      } else {
        betResult.value = false // Pari raté
        const penalty = pile.value.length
        playerDrinks.value[currentPlayer.value] =
          (playerDrinks.value[currentPlayer.value] || 0) + penalty

        setTimeout(() => {
          pile.value = []
          betResult.value = null
          isBetInProgress.value = false // Pari terminé après le délai
        }, 2000)
      }
    }

    // Terminer le tour
    const endTurn = () => {
      if (currentPlayerIndex.value < players.value.length - 1) {
        currentPlayerIndex.value++
      } else {
        currentPlayerIndex.value = 0
      }

      currentPlayer.value = players.value[currentPlayerIndex.value]
      betResult.value = null // Réinitialiser le résultat du pari
    }

    // Quitter le jeu
    const quitGame = () => {
      router.push('/game-modes')
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
      }
    })

    return {
      players,
      currentPlayer,
      pile,
      groupedPile,
      makeBet,
      endTurn,
      quitGame,
      betResult,
    }
  },
})
</script>

<style scoped>
.bet-result {
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 1rem;
}

.bet-result.success {
  color: #4caf50; /* Vert pour succès */
}

.bet-result.failure {
  color: #f44336; /* Rouge pour échec */
}

.quit-button {
  background-color: #8e24aa;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
  border: none;
  margin-top: 1rem;
}

.quit-button:hover {
  background-color: #ba68c8;
  transform: scale(1.05);
}

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
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #ffeb3b;
}

.question {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #f8bbd0;
}

.pile-info {
  font-size: 1.2rem;
  margin-bottom: 1rem;
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

.end-turn-button {
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

.end-turn-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.end-turn-button:hover:not(:disabled) {
  background-color: #e57373;
  transform: scale(1.05);
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cards-row {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}
</style>
