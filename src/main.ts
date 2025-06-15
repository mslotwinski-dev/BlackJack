import { createApp } from 'vue'
import App from './App.vue'

import VueSmoothScroll from 'vue3-smooth-scroll'
import scrollsettings from './config/scroll'
import FontAwesomeIcon from './config/icons'

import router from './router'

import './registerServiceWorker'

createApp(App)
  .component('ic', FontAwesomeIcon)
  .use(VueSmoothScroll, scrollsettings)
  .use(router)
  .mount('#app')
