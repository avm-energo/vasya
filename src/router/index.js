import { createRouter, createWebHistory } from 'vue-router'
import Main from '../components/Main.vue'
import Version from '../components/Version.vue'
import Authorization from '@/pages/Authorization.vue'

const routes = [
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
    meta: {
      access: ['Administrator', 'System_Operator', 'Operator']
    },
  },
  {
    path: '/version',
    name: 'Version',
    component: Version,
    meta: {
      access: ['Administrator', 'System_Operator', 'Operator']
    },
  },
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(function (to, from, next) {
  let isAuth = !!localStorage.getItem('token');
  // console.log(isAuth.split(' ')[1])
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
    if (!to.meta.access.includes(role)) {
      router.go(-1);
      return;
    }
  }
  next();
});

export default router
