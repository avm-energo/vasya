import { createApp } from 'vue'
import App from './App.vue'
// import './registerServiceWorker'
import router from './router'
import store from './store'
// import {VueLogger, vlOptions} from './actions/Logger'
import { onUnmounted } from '@vue/runtime-core'

onUnmounted(() => {
  app.unmount()
  app.config.globalProperties.$cache = null; 
})

createApp(App).use(store)
              .use(router)
              // .use(VueLogger, vlOptions)
              .mount('#app')


