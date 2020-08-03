<template>
  <div class="mt-3 container">
    <h1>Home</h1>
    <p>Welcome {{ user }}</p>
  </div>
</template>
<script>
import db from '../db.js'
export default {
  name: 'home',
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
  }
}
</script>
