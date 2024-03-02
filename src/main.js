import Vue from 'vue'
import router from './router'
import store from './utils/store'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

import HeadBar from './components/HeadBar'
import SideBar from './components/SideBar'

Vue.component('head-bar', HeadBar)
Vue.component('side-bar', SideBar)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
