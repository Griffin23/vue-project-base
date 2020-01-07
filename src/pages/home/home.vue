<template>
  <div :data-v="gitVersion">
    <div v-show="mixin.isLargeScreen">lg</div>
    <div v-show="!mixin.isLargeScreen">sm</div>
    <div class="test-image-webpack-loader">
      <img src="../../assets/img/loli.jpg" alt="loli">
    </div>
  </div>
</template>
<script>
  import { rwdMixin } from '../../assets/js/mixin/rwd-mixin.js';

  export default {
    data() {
      return {
        gitVersion: `${process.env.GIT_BRANCH}-${process.env.GIT_COMMITHASH}`
      };
    },
    mixins: [
      rwdMixin
    ],
    created() {
      console.log(this.$global.foo);
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../assets/css/global";
</style>
