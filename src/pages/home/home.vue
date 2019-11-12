<template>
  <div>
    o.o
  </div>
</template>
<script>
  export default {
    created() {
      console.log(this.$global.foo);
    }
  };
</script>
<style lang="scss" scoped>
  @import "../../assets/css/global";
</style>
