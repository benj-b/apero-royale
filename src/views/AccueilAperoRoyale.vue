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

.slogan {
  font-size: 1.5rem;
  font-style: italic;
  color: #f8bbd0;
  text-align: center;
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
  padding: 0.5rem;
  border-radius: 1rem;
  border: 1px solid #ccc;
  font-size: 0.9rem;
  color: #333;
  max-width: 70%;
}

.add-button {
  background-color: #fbc02d;
  border-radius: 50%;
}

.validate-button {
  background-color: #4caf50;
  color: white;

  margin-top: 15px;
  bottom: 2rem;
  left: 50%;
}

.validate-button:hover {
  background-color: #66bb6a;
  transform: scale(1.05);
}

.flex.items-center {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* Espacement réduit entre l'input et le bouton */
}

@media (max-width: 768px) {
  .input {
    max-width: 60%; /* Réduire encore la largeur sur les petits écrans */
    font-size: 0.8rem; /* Réduire la taille de la police */
  }

  .add-button {
    padding: 0.4rem 0.8rem; /* Réduire la taille du bouton */
    font-size: 0.9rem; /* Réduire la taille de la police du bouton */
  }
}
</style>
