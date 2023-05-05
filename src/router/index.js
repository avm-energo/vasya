import { createRouter, createWebHistory } from 'vue-router'
import Main from '../components/Main.vue'
import Version from '../components/Version.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Main
  },
  {
    path: '/version',
    name: 'Version',
    component: Version
  }
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
