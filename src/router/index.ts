import { createRouter, createWebHistory } from 'vue-router'
import AccueilAperoRoyale from '@/views/AccueilAperoRoyale.vue'
import GameModes from '@/views/GameModes.vue'
import GameSettings from '@/views/GameSettings.vue'
import TuPreferes from '@/views/TuPreferes.vue'
import RecapView from '@/views/Recap.vue'
import Purple from '@/views/Purple.vue'
import GameRules from '@/views/GameRules.vue'
import WheelOfDestiny from '@/views/WheelOfDestiny.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Accueil',
      component: AccueilAperoRoyale,
    },
    {
      path: '/game-modes',
      name: 'GameModes',
      component: GameModes,
    },
    {
      path: '/game-settings',
      name: 'GameSettings',
      component: GameSettings,
    },
    {
      path: '/tu-preferes',
      name: 'Tu Preferes ?',
      component: TuPreferes,
    },
    {
      path: '/purple',
      name: 'Purple',
      component: Purple,
    },
    {
      path: '/recap',
      name: 'RecapEndGame',
      component: RecapView,
    },
    {
      path: '/game-rules',
      name: 'GameRules',
      component: GameRules,
    },
    {
      path: '/roue-du-destin',
      name: 'Roue du destin',
      component: WheelOfDestiny,
    },
  ],
})

export default router
