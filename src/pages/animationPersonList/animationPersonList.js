import Vue from 'vue'
import aop from '../../assets/js/aop.js'
import home from './animationPersonList.vue'

new Vue({
  render: h => h(home),
  i18n: aop.i18n
}).$mount('#app')
