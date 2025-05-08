<template>
  <div class="outer-container">
    <div class="container">
      <h1 class="title">Purple</h1>
      <h2 class="question">{{ currentPlayer }}, fais ton pari !</h2>
      <p v-if="betResult !== null" :class="['bet-result', betResult ? 'success' : 'failure']">
        <template v-if="betResult"> Ça passe ! </template>
        <template v-else>
          <span v-if="currentBet === 'purple'">On part sur un double purple ?</span>
          <span v-else-if="currentBet === 'double_purple'">On part sur un triple purple ?</span>
          <span v-else>Raté...</span>
        </template>
      </p>
      <div v-if="showAllCards" class="popup-overlay" @click.self="showAllCards = false">
        <div class="popup">
          <h3>Toutes les cartes</h3>
          <div class="all-cards-container">
            <Card
              v-for="(card, cardIndex) in pile"
              :key="cardIndex"
              :value="card.value"
              :color="card.color"
              class="small-card"
            />
          </div>
          <button class="close-popup-button" @click="showAllCards = false">Fermer</button>
        </div>
      </div>
      <div class="pile">
        <p class="pile-info">Cartes sur le tas : {{ pile.length }}</p>
        <!-- Affiche le nombre total de cartes -->
        <div class="cards-container">
          <div class="cards-row">
            <Card
              v-for="(card, cardIndex) in pile.slice(-5)"
              :key="cardIndex"
              :value="card.value"
              :color="card.color"
            />
          </div>
        </div>
        <button class="view-all-button" @click="showAllCards = true">Voir toutes les cartes</button>
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
        <div class="button-row">
          <button
            class="special-purple-button"
            v-if="!disabledPlay"
            @click="makeSpecialDoublePurple"
          >
            Double Spécial Purple
          </button>
        </div>
      </div>
      <div class="end-buttons">
        <button
          class="end-turn-button"
          :disabled="pile.length < 3 || isBetInProgress || disabledPlay"
          @click="endTurn"
        >
          Terminer le tour
        </button>
        <button class="quit-button" @click="handleQuitGame">Quitter le jeu</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/useGameStore'
import Card from '@/components/Card.vue'
import { useGameUtils } from '@/utils/gameUtils'

export default defineComponent({
  name: 'PurpleView',
  components: {
    Card,
  },
  setup() {
    const showAllCards = ref(false) // État pour afficher toutes les cartes
    const gameStore = useGameStore()
    const router = useRouter()
    const { quitGame } = useGameUtils()

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
    const currentBet = ref('') // Type de pari en cours

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
      currentBet.value = bet // Définir le type de pari en cours

      if (bet === 'purple') {
        const firstCard = drawCard()
        const secondCard = drawCard()
        pile.value.push(firstCard, secondCard)

        if (firstCard.color !== secondCard.color) {
          betResult.value = true
          isBetInProgress.value = false
          disabledPlay.value = false
        } else {
          canDoublePurple.value = true
          betResult.value = false // Pari raté
        }
        return
      } else if (bet === 'double_purple') {
        const firstCard = drawCard()
        const secondCard = drawCard()
        pile.value.push(firstCard, secondCard)

        const lastFourCards = pile.value.slice(-4)
        const cptNoir = lastFourCards.filter((card) => card.color === 'noir').length
        const cptRouge = lastFourCards.filter((card) => card.color === 'rouge').length

        if (cptNoir === 0 || cptRouge === 0) {
          abend()
          return
        }

        if (cptNoir === cptRouge) {
          betResult.value = true
          isBetInProgress.value = false
          disabledPlay.value = false
          canDoublePurple.value = false
        } else {
          canDoublePurple.value = false
          canTriplePurple.value = true
          betResult.value = false // Pari raté
        }
        return
      } else if (bet === 'triple_purple') {
        const firstCard = drawCard()
        const secondCard = drawCard()
        pile.value.push(firstCard, secondCard)

        const lastSixCards = pile.value.slice(-6)
        const cptNoir = lastSixCards.filter((card) => card.color === 'noir').length
        const cptRouge = lastSixCards.filter((card) => card.color === 'rouge').length

        if (cptNoir === cptRouge) {
          betResult.value = true
          isBetInProgress.value = false
          disabledPlay.value = false
          canTriplePurple.value = false
        } else {
          abend()
        }
        return
      }

      const newCard = drawCard()
      pile.value.push(newCard)

      if (checkBet(bet, newCard)) {
        betResult.value = true
        isBetInProgress.value = false
        disabledPlay.value = false
      } else {
        abend()
      }
    }

    const makeSpecialDoublePurple = () => {
      disabledPlay.value = true // Désactiver les autres actions pendant ce coup

      // Tirer les 8 cartes
      const firstFourCards = Array.from({ length: 4 }, drawCard)
      const lastFourCards = Array.from({ length: 4 }, drawCard)

      // Ajouter les 4 premières cartes d'un coup
      pile.value.push(...firstFourCards)

      // Afficher les 4 dernières cartes une par une avec un délai
      const revealLastFourCards = async () => {
        for (const card of lastFourCards) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          pile.value.push(card)
        }

        // Vérifier si le pari est réussi
        const lastEightCards = pile.value.slice(-8)
        const cptNoir = lastEightCards.filter((card) => card.color === 'noir').length
        const cptRouge = lastEightCards.filter((card) => card.color === 'rouge').length

        if (cptNoir === 4 && cptRouge === 4) {
          // Pari réussi
          betResult.value = true
          isBetInProgress.value = false
          disabledPlay.value = false
        } else {
          // Pari raté
          abend()
        }
      }

      revealLastFourCards()
    }

    // Terminer le tour
    const endTurn = () => {
      currentPlayerIndex.value = (currentPlayerIndex.value + 1) % players.value.length

      currentPlayer.value = players.value[currentPlayerIndex.value]
      betResult.value = null // Réinitialiser le résultat du pari
    }

    //Quitter le jeu
    const handleQuitGame = () => {
      quitGame(playerDrinks.value)
    }

    onMounted(() => {
      if (players.value.length === 0) {
        alert("Aucun joueur n'est sélectionné.")
        router.push('/')
        // players.value = ['a']
      } else {
        players.value.forEach((player) => {
          playerDrinks.value[player] = 0
        })
        currentPlayer.value = players.value[currentPlayerIndex.value]
      }
    })

    return {
      showAllCards,
      players,
      currentPlayer,
      pile,
      abend,
      makeBet,
      makeSpecialDoublePurple,
      endTurn,
      handleQuitGame,
      betResult,
      isBetInProgress,
      canDoublePurple,
      canTriplePurple,
      disabledPlay,
      currentBet,
    }
  },
})
</script>

<style scoped>
.end-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem; /* Espacement horizontal entre les boutons */
  margin-top: 2rem; /* Espacement au-dessus des boutons */
}

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

.question {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #f8bbd0;
}

.pile-info {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 1rem;
  gap: 1rem;
  max-width: 100%; /* Limiter la largeur à celle du conteneur parent */
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  background-color: rgba(255, 255, 255, 0.05);
}

.cards-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem; /* Espacement entre les cartes */
}

@media (max-width: 768px) {
  .cards-container {
    gap: 0.5rem;
  }

  .cards-row .card {
    width: 60px;
    height: 90px;
  }
}

.special-purple-button {
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 0.8),
    rgba(255, 165, 0, 0.8),
    rgba(255, 255, 0, 0.8),
    rgba(0, 128, 0, 0.8),
    rgba(0, 0, 255, 0.8),
    rgba(75, 0, 130, 0.8),
    rgba(238, 130, 238, 0.8)
  );
  background-size: 300% 300%; /* Permet de déplacer le dégradé */
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease;
  border: none;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.special-purple-button:hover {
  transform: scale(1.1);
  animation: rainbow-move 2s infinite linear; /* Animation pour déplacer le dégradé */
}

@keyframes rainbow-move {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

/* Styles pour la popup */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup {
  background: white;
  color: black;
  padding: 2rem;
  border-radius: 1rem;
  max-width: 90%;
  max-height: 80%;
  overflow-y: auto;
  text-align: center;
}

.all-cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.small-card {
  width: 50px; /* Réduire la taille des cartes */
  height: 70px;
}

.close-popup-button {
  margin-top: 1rem;
  background-color: #f44336;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.close-popup-button:hover {
  background-color: #e57373;
}

.view-all-button {
  margin-top: 1rem;
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.view-all-button:hover {
  background-color: #66bb6a;
}
</style>
