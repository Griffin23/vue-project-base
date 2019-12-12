import { SCREEN_BREAKPOINT } from '../const.js';

/***
 * js判断大小屏
 * @returns {boolean}
 */
function isLargeScreen() {
  return window.innerWidth >= SCREEN_BREAKPOINT;
}

export const rwdMixin = {
  data() {
    return {
      mixin: {
        isLargeScreen: isLargeScreen()
      }
    };
  },
  created() {
    window.addEventListener('resize', () => {
      this.mixin.isLargeScreen = isLargeScreen();
    });
    window.addEventListener('orientationchange', () => {
      this.mixin.isLargeScreen = isLargeScreen();
    });
  }
};
