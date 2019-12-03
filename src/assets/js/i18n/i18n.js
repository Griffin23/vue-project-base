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

// language enum
export const langEnum = {
  EN: 'en',
  ZH: 'zh'
};

let i18n = new VueI18n({
  locale: lang,
  messages: messages
});

/***
 * get i18n text by key
 * @param key
 * @returns {VueI18n.TranslateResult}
 */
export function getI18nText(key) {
  return i18n.t(key);
}

/***
 * get i18n text by api response code
 * @param code
 * @returns {VueI18n.TranslateResult}
 */
export function getI18nTextByXXXApiRespCode(code) {
  let key = `api.xxxApi.${code}`;
  return (i18n.te(key) ? getI18nText(key) : getI18nText('api.unknownError'));
}

export default i18n;
