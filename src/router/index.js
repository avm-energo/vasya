import { createRouter, createWebHistory } from 'vue-router'
import Main from '@/components/Main.vue'
import Version from '@/components/Version.vue'
import Authorization from '@/pages/Authorization.vue'
import {login} from "@/actions/AuthorizationActions";

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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async function (to, from, next) {
  let isAuth = !!localStorage.getItem('token');
  // console.log("isAuth = ", isAuth)
  // console.log("to = ", to)
  let name = 'АСУ-ВЭИ'
  if (to.meta.title) {
    document.title = name + ' | ' + to.meta.title;
  } else {
    document.title = name;
  }
  if (to.name === 'Authorization' && !isAuth && from.path == '/') {
    await login('Guest', 'Guest', (e) =>{
      isAuth = true
      next()
    })
  }
  if (to.name === 'Authorization' && isAuth) {
    router.push('/sonica');
    return;
  }
  if (to.name !== 'Authorization') {
    if (!isAuth) {
      console.log("Переходим на страницу авторизации")
      router.push('/authorization');
      return;
    }
  }
  next();
});

export default router
