import Vue from 'vue';
import VueI18n from 'vue-i18n';
import enMsg from './locale/en.js';
import zhMsg from './locale/zh.js';

Vue.use(VueI18n);

let messages = {
  'en': enMsg,
  'zh': zhMsg
};

let lang = 'en';

// 外部组件库设置多语言需要用到该枚举
export const langEnum = {
  EN: 'en',
  ZH: 'zh'
};

export default new VueI18n({
  locale: lang,
  messages: messages
});
