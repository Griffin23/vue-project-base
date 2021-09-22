// 切面js，多页面入口js引用本js
import Vue from 'vue'

import i18n from './i18n/i18n.js'

import './ajax/ajax.js'

// 设置全局变量
let global = {
  foo: 'bar'
}
Vue.prototype.$global = global

export default {
  i18n
}
