<template>
  <div class="outer-container">
    <div class="container">
      <h1 class="title">Modes de jeu</h1>
      <div class="game-card" @click="goToGameRules('tu-preferes')">
        <h2 class="game-title">Tu préfères ?</h2>
        <p class="game-description">Arriveras-tu à choisir entre deux terribles options ?</p>
      </div>
      <div class="game-card" @click="goToGameRules('purple')">
        <h2 class="game-title">Purple</h2>
        <p class="game-description">
          Arriveras-tu à les cartes ? Attention le total peut devenir salé !
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'GameModes',
  setup() {
    const router = useRouter()

    const goToGameRules = (name: string) => {
      // Redirection vers la vue des règles du jeu
      router.push({
        path: '/game-rules',
        query: { gameName: name },
      })
    }

    return {
      goToGameRules,
    }
  },
})
</script>

<style scoped>
.game-card {
  background: rgba(255, 255, 255, 0.2);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  margin-bottom: 1.5rem;
}

.game-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #ffeb3b;
  margin-bottom: 1rem;
}

.game-description {
  font-size: 1.2rem;
  color: #f8bbd0;
  line-height: 1.5;
}
</style>
