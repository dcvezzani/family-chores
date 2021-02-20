import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Auth from './plugins/auth'

Vue.config.productionTip = false

Vue.use(Auth)

window.Event = new Vue()

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
