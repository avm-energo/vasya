import { createRouter, createWebHistory } from 'vue-router'
import Main from '../components/Main.vue'
import Version from '../components/Version.vue'
import Authorization from '@/pages/Authorization.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/sonica'
  },
  {
    path: '/authorization',
    name: 'Authorization',
    component: Authorization,
    meta: {
      title: 'Авторизация'
    },
  },
  {
    path: '/sonica',
    name: 'Sonica',
    component: Main,
  },
  {
    path: '/version',
    name: 'Version',
    component: Version,
  },
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(function (to, from, next) {
  let isAuth = !!localStorage.getItem('token');
  let role = localStorage.getItem('role')
  let name = 'АСУ-ВЭИ'
  if (to.meta.title) {
    document.title = name + ' | ' + to.meta.title;
  } else {
    document.title = name;
  }
  if (to.name === 'Authorization' && isAuth) {
    router.push('/sonica');
    return;
  }
  if (to.name !== 'Authorization') {
    if (!isAuth) {
      router.push('/authorization');
      return;
    }
  }
  next();
});

export default router
