import { createRouter, createWebHistory } from 'vue-router'
import Main from '../components/Main.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Main
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// router.beforeEach((to, from, next) => {
//   document.title = to.name;
//   next();
// });

export default router
