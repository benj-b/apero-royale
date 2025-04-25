<template>
  <div class="outer-container">
    <div class="container">
      <h1 class="title">Récapitulatif</h1>
      <ul class="recap-list">
        <li v-for="(drinks, player) in playerDrinks" :key="player">
          {{ player }} : {{ drinks }} gorgées
        </li>
      </ul>
      <button class="back-button" @click="goToHome">Retour à l'accueil</button>
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

    return {
      playerDrinks,
      goToHome,
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

.title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #ffeb3b;
}

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

.back-button {
  background-color: #4caf50;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
}

.back-button:hover {
  background-color: #66bb6a;
  transform: scale(1.05);
}
</style>
