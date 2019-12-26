import { debounce, isJsFunction } from './util.js';

// fixme: window.addEventListener的兼容性写法
export function registerScrollEventListener(eventHandler) {
  if (!isJsFunction(eventHandler)) {
    // 这里演示如何正确地获取scrollTop值
    eventHandler = debounce(() => {
      // scrollTop值的兼容性写法
      let scrollTopVal = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      if (scrollTopVal > 0) {
        console.log(scrollTopVal);
      }
    });
  }
  window.addEventListener('scroll', eventHandler);
}
