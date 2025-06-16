import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Blackjack from '../views/Blackjack.vue'
import Cash from '../views/Cash.vue'

import Gernot from '../views/Gernot.vue'
import Barman from '../views/Barman.vue'
import Estate from '../views/Estate.vue'
import Wizzair from '../views/Wizzair.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/blackjack',
    component: Blackjack,
  },
  {
    path: '/cash',
    component: Cash,
  },
  {
    path: '/gernot',
    component: Gernot,
  },
  {
    path: '/barman',
    component: Barman,
  },
  {
    path: '/estate',
    component: Estate,
  },
  {
    path: '/wizzair',
    component: Wizzair,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
