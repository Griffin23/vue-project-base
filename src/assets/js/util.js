/*
底层工具

只依赖一些常量，不依赖其他工具js
 */

export function isDev() {
  return process.env.NODE_ENV === 'development';
}

export function isTest() {
  return process.env.NODE_ENV === 'test';
}

export function isProd() {
  return process.env.NODE_ENV === 'production';
}

export function isJsFunction(fn) {
  return typeof fn === 'function';
}

// region browser

export function getQueryString(name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  let r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURI(r[2]);
  }
  return null;
}

export function getCookie(cookieName) {
  if (document.cookie.length > 0) {
    let startIndex = document.cookie.indexOf(cookieName + '=');
    let endIndex = -1;
    if (startIndex !== -1) {
      startIndex += cookieName.length + 1;
      endIndex = document.cookie.indexOf(';', startIndex);
      if (endIndex === -1) {
        endIndex = document.cookie.length;
      }
      return decodeURIComponent(document.cookie.substring(startIndex, endIndex));
    }
  }
  return '';
}

export function setCookie(cookieName, cookieValue, expireMillisecond) {
  let now = new Date();
  let expireDateTime = new Date(now.getTime() + expireMillisecond);
  document.cookie = `${cookieName}=${encodeURIComponent(cookieValue)}` +
    `${(expireMillisecond == null) ? '' : `;expires=${expireDateTime.toGMTString()}`}`;
}

// 当前页打开链接
export function openLinkThisTab(link) {
  if (link) {
    window.location.href = link;
  }
}

// 新标签页打开链接
export function openLinkNewTab(link) {
  if (link) {
    window.open(link);
  }
}

export function getOrigin() {
  let location = window.location;
  let origin = location.origin;
  if (origin === undefined) {
    return `${location.protocol}//${location.hostname}${(location.port
      ? `:${location.port}` : '')}`;
  }
  return origin;
}

/***
 * 注册按下Esc键的监听事件，执行callback
 *
 * @param cb callback函数
 * @param isPermenantReg 是否永久注册。
 *    ture，只注册一次即可（如在组件的created()里面注册），
 *        但多个注册了esc键监听事件的dom同时激活时，一次esc会隐藏所有dom。
 *        注意：永久注册的事件只会在回调函数栈空时才会执行，否则优先执行非永久注册的esc键事件
 *    false，需要在组件每次show时注册，原理是维持一个回调函数栈，每次esc键按下时，
 *        只会执行栈顶的回调函数，这样可以解决一次esc隐藏所有dom的问题。
 */
let escCbStack = [];
let hasRegisterEscKeyDownEventListener = false;
export function registerEscKeyDown(cb, isPermenantReg) {
  if (isPermenantReg) {
    window.addEventListener('keydown', (evt) => {
      if ((evt.key === 'Escape' || evt.key === 'Esc') && isJsFunction(cb) && escCbStack.length === 0) {
        cb();
      }
    });
  } else {
    if (isJsFunction(cb)) {
      escCbStack.push(cb);
    }
    if (!hasRegisterEscKeyDownEventListener) {
      // 只注册一次
      hasRegisterEscKeyDownEventListener = true;
      window.addEventListener('keydown', (evt) => {
        if (evt.key === 'Escape' || evt.key === 'Esc') {
          let curCb = escCbStack.pop();
          if (isJsFunction(curCb)) {
            curCb();
          }
        }
      });
    }
  }
}

/***
 * 函数防抖。
 *
 * 使用场景：不间断触发的某个操作，如监听scroll执行事件处理函数。
 *
 * 意义：加入防抖，能够使事件处理函数在某个时间间隔后再执行，如果在这个时间间隔内再次触发了操作，
 * 需要重新计时。这样能避免不间断地执行事件处理函数。
 *
 * 使用方法：如 window.addEventListener('scroll', debounce(fn, 500));
 * @param fn 事件处理函数
 * @param interval 间隔，单位毫秒，默认100
 * @returns {Function}
 */
export function debounce(fn, interval = 100) {
  let timeout = null;
  let args = [].slice.call(arguments, 2);
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, interval);
  };
}

// endregion

// region dom

/***
 * insert new element after ref element
 */
export function insertAfter(newEle, refEle) {
  let parent = refEle.parentNode;
  if (parent.lastChild === refEle) {
    parent.appendChild(newEle);
  } else {
    parent.insertBefore(newEle, refEle.nextSibling);
  }
}

export function hasCssClass(ele, clazzName) {
  return !!ele.className.match(new RegExp("(\\s|^)" + clazzName + "(\\s|$)"));
}

export function addCssClass(ele, clazzName) {
  if (!hasCssClass(ele, clazzName)) {
    ele.className += " " + clazzName;
  }
}

export function removeCssClass(ele, clazzName) {
  if (hasCssClass(ele, clazzName)) {
    ele.className = ele.className.replace(new RegExp("(\\s|^)" + clazzName + "(\\s|$)"), " ");
  }
}

// 固定底部背景（如遮罩层的出现）
export function fixBackground() {
  document.body.style.overflow = 'hidden';
}

// 取消固定底部背景（如遮罩层的隐藏）
export function cancelFixBackground() {
  document.body.style.overflow = '';
}

// endregion
