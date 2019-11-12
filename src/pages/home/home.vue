<template>
  <div>
    <div class="griffin23-container foo-container">
      hoho
    </div>
    <div class="small-screen-hide">
      测试小屏隐藏
    </div>
  </div>
</template>
<script></script>
<style lang="scss" scoped>
  @import "../../assets/css/global";

  .foo-container {
    @include large-screen-style {
      background-color: red;
    }
    @include small-screen-style {
      background-color: yellow;
    }
  }
</style>
