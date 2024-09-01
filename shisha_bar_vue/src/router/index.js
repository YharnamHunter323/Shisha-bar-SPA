// Importarea modulelor necesare pentru router
import { createRouter, createWebHistory } from 'vue-router'
// Importarea componentelor pentru rutele aplicației
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import ContactView from '../views/ContactView.vue'
import ReservationView from '../views/ReservationView.vue'
import MenuView from '../views/MenuView.vue'
import SignIn from '../views/SignIn.vue'

// Definirea rutelor aplicației
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/contact',
    name: 'contact',
    component: ContactView
  },
  {
    path: '/reservation',
    name: 'reservation',
    component: ReservationView
  },
  {
    path: '/sign-in',
    component: SignIn
  },
  {
    path: '/menu',
    name: 'menu',
    component: MenuView
  }
]

// Crearea instanței routerului
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
