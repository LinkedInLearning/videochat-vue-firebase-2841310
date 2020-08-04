<template>
  <div>
    <nav class="navbar navbar-expand bg-primary navbar-dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/"
          ><span class="h2 pr-1">Video Chat</span>
          <span class="navbar-text small">
            : Hi <span class="font-weight-bold text-white">{{ user }}</span></span
          >
        </router-link>
        <div class="navbar-nav ml-auto">
          <router-link class="nav-item nav-link" to="/login">log in</router-link>
          <router-link class="nav-item nav-link" to="/register">register</router-link>
        </div>
      </div>
    </nav>
  </div>
</template>
<script>
export default {
  name: 'Navigation',
  props: ['user']
}
</script>
