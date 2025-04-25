<template>
  <div class="outer-container">
    <div class="container">
      <div class="text-center mb-12">
        <h1 class="title">Apéro Royale</h1>
        <p class="slogan">Le jeu où tu bois... ou tu choisis !</p>
      </div>

      <div class="flex justify-center">
        <button v-if="!showPlayerMenu" @click="showPlayerMenu = true" class="button">Jouer</button>
      </div>

      <div v-if="showPlayerMenu" class="player-menu">
        <p class="text-lg font-medium mb-4 text-center">Qui participe au jeu ?</p>
        <div class="flex items-center gap-2 mb-4">
          <input
            v-model="newPlayer"
            @keyup.enter="addPlayer"
            type="text"
            placeholder="Nom du joueur"
            class="input"
          />
          <button @click="addPlayer" class="add-button">+</button>
        </div>

        <ul class="list">
          <li v-for="(player, index) in players" :key="index">{{ player }}</li>
        </ul>
      </div>
      <div v-if="players.length > 0" class="flex justify-center mt-4">
        <button @click="goToGameModes" class="validate-button">Valider</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/useGameStore'

export default defineComponent({
  name: 'AccueilAperoRoyale',
  setup() {
    const showPlayerMenu = ref(false)
    const newPlayer = ref('')
    const players = ref<string[]>([])
    const router = useRouter()
    const gameStore = useGameStore()

    const addPlayer = () => {
      if (newPlayer.value.trim()) {
        players.value.push(newPlayer.value.trim())
        newPlayer.value = ''
      }
    }

    const goToGameModes = () => {
      // Redirection vers le menu des modes de jeu
      gameStore.setPlayers(players.value)
      router.push('/game-modes')
    }

    return {
      showPlayerMenu,
      newPlayer,
      players,
      addPlayer,
      goToGameModes,
    }
  },
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

.outer-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(to bottom, #6a1b9a, #ec407a);
}

.container {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 2rem;
  font-family: 'Arial', sans-serif;

  /* Bande centrée pour affichage mobile */
  max-width: 400px; /* Largeur maximale pour mobile */
  width: 100%; /* S'adapte à l'écran */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); /* Optionnel : ajoute une ombre */
  border-radius: 1rem; /* Optionnel : arrondit les coins */
  text-align: center; /* Centre le texte */
}

.title {
  font-family: 'Pacifico', cursive;
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #fbc02d;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  animation: pulse 1.5s infinite;
}

.slogan {
  font-size: 1.5rem;
  font-style: italic;
  color: #f8bbd0;
  text-align: center;
}

.button {
  background-color: #fbc02d;
  color: #8e24aa;
  padding: 1rem 2rem;
  border-radius: 1.5rem;
  font-weight: bold;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
}

.button:hover {
  background-color: #ffeb3b;
  transform: scale(1.05);
}

.player-menu {
  max-width: 600px;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  margin-top: 2rem;
}

.input {
  flex: 1;
  padding: 0.75rem;
  border-radius: 1rem;
  border: 1px solid #ccc;
  font-size: 1rem;
  color: #333;
}

.add-button {
  background-color: #fbc02d;
  color: #8e24aa;
  padding: 0.5rem 1rem;
  border-radius: 50%;
  font-weight: bold;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
}

.add-button:hover {
  background-color: #ffeb3b;
  transform: scale(1.2);
}

.list {
  list-style-type: disc;
  padding-left: 1rem;
  color: white;
  font-size: 1.2rem;
}

.validate-button {
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

  margin-top: 15px;
  bottom: 2rem;
  left: 50%;
}

.validate-button:hover {
  background-color: #66bb6a;
  transform: scale(1.05);
}

@keyframes pulse {
  0% {
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  }
  50% {
    text-shadow: 2px 2px 15px rgba(0, 0, 0, 0.5);
  }
  100% {
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  }
}
</style>
