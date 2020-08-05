import Vue from 'vue'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrash, faVideo, faUser } from '@fortawesome/free-solid-svg-icons'

library.add(faTrash, faVideo, faUser)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
