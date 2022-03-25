<template>
  <div class="page-container-wrapper">
    <div class="page-container" :style="scaleStyle" style="transform-origin: left top;">
      <portalHeader />
      <colorfulMenu class="colorful-menu"/>
    </div>
  </div>
</template>
<script>
import screenScaleMixin from '../../assets/js/mixin/screenScaleMixin.js'
import portalHeader from './colorfulPortalComponents/portalHeader.vue'
import colorfulMenu from './colorfulPortalComponents/colorfulMenu.vue'

export default {
  name: 'HljJwYiJiCaiDanPage',
  components: {
    portalHeader,
    colorfulMenu
  },
  mixins: [
    screenScaleMixin
  ]
}
</script>
<style lang="scss" scoped>
.page-container-wrapper {
  width: 100%;
  height: 100vh;
  overflow: hidden;

  .page-container {
    width: 1920px;
    height: 1080px;
    background-image: url("./colorfulPortalImgs/bg.jpg");
    background-size: 100% 100%;
    background-repeat: no-repeat;

    .colorful-menu {
      position: absolute;
      top: 260px;
      left: 0;
      right: 0;
      margin: auto;
    }
  }
}
</style>
