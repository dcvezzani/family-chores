<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <span v-if="false"> | <router-link to="/token">Token</router-link> </span>
      <span> | <router-link to="/secret">Secret</router-link> </span>
      <span v-if="isLoggedIn"> | <router-link to="/profile">Profile</router-link> </span>
      <span> | <router-link to="/about">About</router-link> </span>
      <Auth></Auth>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  props: ['msg'],
  data() {
    return {
      isLoggedIn: false,
    }
  },
  methods: {
    onLoginLogoutEvent(event) {
      this.isLoggedIn = document.cookie.includes('chores_app_loggedin')
    },
  },
  mounted() {
    Event.$on('onLoginLogoutEvent', this.onLoginLogoutEvent)
    this.onLoginLogoutEvent()
  },
  beforeDestroy() {
    Event.$off('onLoginLogoutEvent', this.onLoginLogoutEvent)
  },
}
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
