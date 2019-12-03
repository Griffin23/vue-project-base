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

// region browser

export function getQueryString(name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  let r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURI(r[2]);
  }
  return null;
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
 * 注册按下Esc键监听，执行callback
 * @param cb callback函数
 */
export function registerEscKeyDown(cb) {
  window.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape' && typeof cb === 'function') {
      cb();
    }
  });
}

// endregion

// region dom
// 固定底部背景（如遮罩层的出现）
export function fixBackground() {
  document.body.style.overflow = 'hidden';
}

// 取消固定底部背景（如遮罩层的隐藏）
export function cancelFixBackground() {
  document.body.style.overflow = '';
}

// endregion
