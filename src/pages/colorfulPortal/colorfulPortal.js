import Vue from 'vue'
import aop from '../../assets/js/aop.js'
import home from './colorfulPortal.vue'

import { Row, Col } from 'element-ui'

Vue.use(Row)
Vue.use(Col)

new Vue({
  render: h => h(home),
  i18n: aop.i18n,
}).$mount('#app')
