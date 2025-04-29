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
        <div class="button-row">
          <button
            class="choice-button"
            v-if="!(canDoublePurple || canTriplePurple || disabledPlay)"
            @click="makeBet('noir')"
          >
            Noir
          </button>
          <button
            class="choice-button"
            v-if="!(canDoublePurple || canTriplePurple || disabledPlay)"
            @click="makeBet('rouge')"
          >
            Rouge
          </button>
        </div>

        <div
          class="button-row"
          v-if="pile.length > 0 && !(canDoublePurple || canTriplePurple || disabledPlay)"
        >
          <button class="choice-button" @click="makeBet('plus')">Plus</button>
          <button class="choice-button" @click="makeBet('moins')">Moins</button>
        </div>

        <div
          class="button-row"
          v-if="pile.length > 1 && !(canDoublePurple || canTriplePurple || disabledPlay)"
        >
          <button class="choice-button" @click="makeBet('interieur')">Intérieur</button>
          <button class="choice-button" @click="makeBet('exterieur')">Extérieur</button>
        </div>

        <div class="button-row">
          <button
            class="choice-button"
            v-if="!(canDoublePurple || canTriplePurple || disabledPlay)"
            @click="makeBet('purple')"
          >
            Purple
          </button>
          <button class="choice-button" v-if="canDoublePurple" @click="makeBet('double_purple')">
            Double Purple
          </button>
          <button class="choice-button" v-if="canTriplePurple" @click="makeBet('triple_purple')">
            Triple Purple
          </button>
          <button
            class="choice-button"
            v-if="(canDoublePurple || canTriplePurple) && !disabledPlay"
            @click="abend"
          >
            Abandonner mon purple
          </button>
        </div>
      </div>
      <button
        class="end-turn-button"
        :disabled="pile.length < 3 || isBetInProgress || disabledPlay"
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
    const canDoublePurple = ref(false)
    const canTriplePurple = ref(false)
    const disabledPlay = ref(false)

    const groupedPile = computed(() => {
      const groups = []
      for (let i = 0; i < pile.value.length; i += 5) {
        groups.push(pile.value.slice(i, i + 5))
      }
      return groups
    })

    // pari raté
    const abend = () => {
      betResult.value = false
      const penalty = pile.value.length
      playerDrinks.value[currentPlayer.value] =
        (playerDrinks.value[currentPlayer.value] || 0) + penalty

      setTimeout(() => {
        alert(`Tu bois ${penalty} gorgées !`) // Alerte pour le joueur
        setTimeout(() => {
          pile.value = []
          betResult.value = null
          isBetInProgress.value = false // Pari terminé après le délai
          disabledPlay.value = false
          canDoublePurple.value = false
          canTriplePurple.value = false
        }, 10)
      }, 500)
    }

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
      disabledPlay.value = true

      if (bet === 'purple') {
        // Tirer deux cartes pour le pari "Purple"
        const firstCard = drawCard()
        const secondCard = drawCard()
        pile.value.push(firstCard, secondCard)

        // Vérifier les deux dernières cartes
        if (firstCard.color !== secondCard.color) {
          // Les deux cartes sont de couleurs différentes → Pari réussi
          betResult.value = true
          isBetInProgress.value = false
          disabledPlay.value = false
        } else {
          // Les deux cartes sont de la même couleur → Activer le double purple
          canDoublePurple.value = true
        }
        return
      }

      if (bet === 'double_purple') {
        // Tirer deux cartes pour le pari "Double Purple"
        const firstCard = drawCard()
        const secondCard = drawCard()
        pile.value.push(firstCard, secondCard)

        // Vérifier les 4 dernières cartes
        const lastFourCards = pile.value.slice(-4)
        const cptNoir = lastFourCards.filter((card) => card.color === 'noir').length
        const cptRouge = lastFourCards.filter((card) => card.color === 'rouge').length

        if (cptNoir === 0 || cptRouge === 0) {
          // Toutes les cartes sont de la même couleur → Pari perdu immédiatement
          abend()
          return
        }

        if (cptNoir === cptRouge) {
          // Autant de cartes noires que de rouges → Pari réussi
          betResult.value = true
          isBetInProgress.value = false
          disabledPlay.value = false
          canDoublePurple.value = false
        } else {
          // Sinon, activer le triple purple
          canDoublePurple.value = false
          canTriplePurple.value = true
        }
        return
      }

      if (bet === 'triple_purple') {
        // Tirer deux cartes pour le pari "Triple Purple"
        const firstCard = drawCard()
        const secondCard = drawCard()
        pile.value.push(firstCard, secondCard)

        // Vérifier les 6 dernières cartes
        const lastSixCards = pile.value.slice(-6)
        const cptNoir = lastSixCards.filter((card) => card.color === 'noir').length
        const cptRouge = lastSixCards.filter((card) => card.color === 'rouge').length

        if (cptNoir === cptRouge) {
          // Autant de cartes noires que de rouges → Pari réussi
          betResult.value = true
          isBetInProgress.value = false
          disabledPlay.value = false
          canTriplePurple.value = false
        } else {
          // Sinon, pari raté
          abend()
        }
        return
      }

      // Logique pour les autres paris
      const newCard = drawCard()
      pile.value.push(newCard)

      if (checkBet(bet, newCard)) {
        betResult.value = true // Pari réussi
        isBetInProgress.value = false // Pari terminé
        disabledPlay.value = false
      } else {
        abend()
      }
    }

    // Terminer le tour
    const endTurn = () => {
      currentPlayerIndex.value = (currentPlayerIndex.value + 1) % players.value.length

      currentPlayer.value = players.value[currentPlayerIndex.value]
      betResult.value = null // Réinitialiser le résultat du pari
    }

    // Quitter le jeu
    const quitGame = () => {
      router.push({
        path: '/recap',
        query: { playerDrinks: JSON.stringify(playerDrinks.value) },
      })
    }

    onMounted(() => {
      if (players.value.length === 0) {
        alert("Aucun joueur n'est sélectionné.")
        // router.push('/')
        players.value = ['a']
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
      abend,
      makeBet,
      endTurn,
      quitGame,
      betResult,
      isBetInProgress,
      canDoublePurple,
      canTriplePurple,
      disabledPlay,
    }
  },
})
</script>

<style scoped>
.buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Espacement entre les lignes */
  margin-top: 2rem; /* Ajouter un espace entre les cartes et les boutons */
}

.button-row {
  display: flex;
  justify-content: center;
  gap: 1rem; /* Espacement entre les boutons */
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
