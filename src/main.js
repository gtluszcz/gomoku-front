import Vue from 'vue'
Vue.config.productionTip = false
Vue.config.devtools = true


import App from './App'

/* eslint-disable no-new */
new Vue({
    el: '#app',
    components: { App },
    template: '<App/>',
})
