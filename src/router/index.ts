import { createRouter, createWebHistory } from 'vue-router'
import AccueilAperoRoyale from '@/views/AccueilAperoRoyale.vue'
import GameModes from '@/views/GameModes.vue'
import GameSettings from '@/views/GameSettings.vue'
import TuPreferes from '@/views/TuPreferes.vue'
import RecapView from '@/views/Recap.vue'

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
      path: '/recap',
      name: 'RecapEndGame',
      component: RecapView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
