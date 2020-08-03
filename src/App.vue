<template>
  <div id="app">
    <Navigation :user="user" />
    <router-view :user="user" />
  </div>
</template>
<script>
import db from './db.js'
import Navigation from '@/components/Navigation'
export default {
  name: 'App',
  data: function() {
    return {
      user: null
    }
  },
  mounted() {
    db.collection('users')
      .doc('39mtRZ22vlE7gp3L11Qk')
      .get()
      .then(snapshot => {
        this.user = snapshot.data().name
      })
  },
  components: {
    Navigation
  }
}
</script>
<style lang="scss">
$primary: #5f2882;
@import 'node_modules/bootstrap/scss/bootstrap';
</style>
