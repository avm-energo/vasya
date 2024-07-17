import { createApp } from 'vue'
import App from './App.vue'
// import './registerServiceWorker'
import router from './router'
import store from './store'
// import {VueLogger, vlOptions} from './actions/Logger'
import { onUnmounted } from '@vue/runtime-core'

onUnmounted(() => {
  App.unmount()
  App.config.globalProperties.$cache = null;
})

if ('serviceWorker' in navigator) {
  if (!navigator.serviceWorker?.controller) {
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
}

import { library } from '@fortawesome/fontawesome-svg-core'

/* import specific icons */
import { fas } from '@fortawesome/free-solid-svg-icons'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(fas)

createApp(App).component('v-icon', FontAwesomeIcon)
              .use(store)
              .use(router)
              // .use(VueLogger, vlOptions)
              .mount('#app')


