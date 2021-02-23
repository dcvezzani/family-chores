<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <span v-if="false"> | <router-link to="/token">Token</router-link> </span>
      <span> | <router-link to="/secret">Secret</router-link> </span>
      <span> | <router-link to="/about">About</router-link> </span>
      <span v-if="!userIsLoggedIn"> | <router-link to="/login">Login (local)</router-link> </span>
      <span v-if="userIsLoggedIn"> | <router-link to="/logout">Logout</router-link> </span>
    </div>
    <router-view/>
  </div>
</template>

<script>
const { Cookies } = require('./cookies')

export default {
  name: 'App',
  props: ['msg'],
  data() {
    return {
      userIsLoggedIn: false,
    }
  },
  mounted() {
    Event.$on('onLoginLogoutEvent', () => {
      const cookies = new Cookies()
      this.userIsLoggedIn = (cookies.get('chores_app_loggedin') === 'true')
    })
    Event.$emit('onLoginLogoutEvent')
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
