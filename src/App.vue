<template>
  <div id="app">
    <Navigation />
    <router-view />
  </div>
</template>
<script>
import Navigation from '@/components/Navigation'
export default {
  components: {
    Navigation
  }
}
</script>
<style lang="scss">
$primary: #5f2882;
@import 'node_modules/bootstrap/scss/bootstrap';
</style>
