<template>
  <div class="outer-container">
    <div class="container">
      <h1 class="title">Récapitulatif</h1>
      <ul class="recap-list">
        <li v-for="(drinks, player) in playerDrinks" :key="player">
          {{ player }} : {{ drinks }} gorgées
        </li>
      </ul>
      <button class="quit-button" @click="goToHome">Menu Principal</button>
      <button class="back-button" @click="goToGames">Changer de jeu</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'RecapView',
  setup() {
    const router = useRouter()
    const route = useRoute()

    const playerDrinks = ref<Record<string, number>>(
      JSON.parse((route.query.playerDrinks as string) || '{}'),
    )

    const goToHome = () => {
      router.push('/')
    }

    const goToGames = () => {
      router.push('/game-modes')
    }

    return {
      playerDrinks,
      goToHome,
      goToGames,
    }
  },
})
</script>

<style scoped>
.recap-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 1.2rem;
  color: #f8bbd0;
}

.recap-list li {
  margin-bottom: 0.5rem;
}
</style>
