<template>
  <div class="outer-container" :class="getGameClass()">
    <div class="container">
      <h1 class="title">{{ getGameName() }}</h1>
      <p class="description" v-html="getGameDescription()"></p>
      <div class="buttons">
        <button class="back-button" @click="goBack">Une autre fois</button>
        <button class="play-button" @click="startGame">JOUER</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'GameRules',
  setup() {
    const router = useRouter()
    const route = useRoute()

    const games = {
      'tu-preferes': {
        name: 'Tu Préfères',
        description:
          "<i>Es-tu prêt à faire des choix impossibles ?</i> <br> Dans ce jeu, tu devras choisir entre deux options <strong>terribles, hilarantes ou complètement absurdes.</strong> Attention, il n'y a pas de bonne réponse, juste des choix qui feront rire (ou pleurer) tout le monde autour de la table. Alors, tu préfères quoi ? 😏",
        class: 'tu-preferes-game',
      },
      purple: {
        name: 'Purple',
        description:
          '<i>Un jeu de cartes où chaque pari peut tout changer !</i> <br>Dans Purple, le but est simple : <strong>parie sur la prochaine carte qui va sortir.</strong> Sera-t-elle 🔴 ou ⚫ ? ➕ ou ➖ grande que la précédente ? Mais attention, tu dois poser 3 cartes avant de pouvoir envoyer la bombe à ton voisin. Chaque pari te rapproche de la cuite ! Sauras-tu jouer avec le feu sans te brûler ? 🔥🎴',
        class: 'purple-game',
      },
    }

    // Récupérer les informations du jeu depuis les paramètres de la route
    const gameName = ref(route.query.gameName || 'Jeu inconnu')

    const getGameDescription = () => {
      const game = games[gameName.value.toLowerCase()]
      return game ? game.description : 'Description non disponible pour ce jeu.'
    }

    const getGameClass = () => {
      const game = games[gameName.value.toLowerCase()]
      return game ? game.class : {}
    }

    const getGameName = () => {
      const game = games[gameName.value.toLowerCase()]
      return game ? game.name : 'Jeu inconnu'
    }

    const startGame = () => {
      if (gameName.value == 'purple') {
        router.push('/purple')
      } else
        router.push({
          path: '/game-settings',
          query: { gameName: gameName.value },
        })
    }

    const goBack = () => {
      router.push('/game-modes')
    }

    return {
      getGameDescription,
      getGameClass,
      getGameName,
      games,
      gameName,
      startGame,
      goBack,
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
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #ffeb3b;
}

.description {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #f8bbd0;
}

.buttons {
  display: flex;
  justify-content: space-around;
}

.play-button {
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

.play-button:hover {
  background-color: #66bb6a;
  transform: scale(1.05);
}

.back-button {
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

.back-button:hover {
  background-color: #e57373;
  transform: scale(1.05);
}

.tu-preferes-game {
  background: linear-gradient(to right, #ff990073, #f4433691);
}

.purple-game {
  background: linear-gradient(to right, #6a1b9a, #ec4079c5);
}
</style>
