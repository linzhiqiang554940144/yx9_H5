import Vue from 'vue'
import App from './App'
import $router, { $route } from './pages/components/js/uni_router.js'
import { http } from './pages/common/request.js'
import store from './pages/store'
Vue.prototype.$http = http

Vue.prototype.$store = store
Vue.prototype.formatMoney = function (e) {  
   return Math.floor(e * 1000) / 1000;
}

Vue.prototype.getUserInfo =  async function() {  
   let result = await this.$http.get(process.env.USER_API + '/v1/personal/user/info').then(res => {
		return res.data
   })
   return result
}

Vue.prototype.postMessageTxt = function(name,data) {  
	console.log(name,data)
  this.$http.post("/message", { name: name,data: data}).then(res => {})
}

import game from './pages/views/game/home.vue'
Vue.component('game',game)

import channel from './pages/views/channel/home.vue'
Vue.component('channel',channel)

import service from './pages/views/service/home.vue'
Vue.component('service',service)

import my from './pages/views/my/home.vue'
Vue.component('my',my)

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)

import backHeader from './pages/components/header/backHeader.vue'
Vue.component('cu-header',backHeader)

import pay from './pages/components/pay/pay.vue'
Vue.component('pay',pay)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()

 



