import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(fas);

const app = createApp(App);

// Очистка кэша перед закрытием вкладки
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (app.config.globalProperties.$cache) {
      app.config.globalProperties.$cache = null;
    }
  });
}

// Регистрация Service Worker
if ('serviceWorker' in navigator && !navigator.serviceWorker.controller) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(registration => {
        console.log('Service Worker registered:', registration);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

app.component('v-icon', FontAwesomeIcon)
   .use(store)
   .use(router)
   .mount('#app');