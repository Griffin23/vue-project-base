<template>
  <div>
    <div>
      {{ $t('foo') }}
    </div>
    <button @click="toggleLang">toggle language</button>
  </div>
</template>
<script>
export default {
  methods: {
    toggleLang() {
      this.$i18n.locale = (this.$i18n.locale === 'en') ? 'zh' : 'en'
    }
  }
}
</script>
<style></style>
