<template>
  <div class="wrap">
    <div class="inner" :style="`animation: scroll-text-animation ${loopTimeMs * 2}ms linear infinite;`">
      <span class="inner-item" v-for="i in 2" :key="i">
        <span v-for="j in spaceCount" :key="j">&nbsp;</span>{{ text }}
      </span>
    </div>
  </div>
</template>
<script>

// 使用时，为本组件设置一下长度、宽度即可

export default {
  name: 'ScrollText',
  props: {
    text: {
      type: String
    },
    loopTimeMs: {
      type: Number,
      default: 2500
    },
    // 空格数量
    spaceCount: {
      type: Number,
      default: 2
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  overflow: hidden;
  white-space: nowrap;
  position: relative;

  .inner {
    position: absolute;

    .inner-item {
      display: inline-block;
    }
  }
}
</style>
<style lang="scss">
@keyframes scroll-text-animation {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
