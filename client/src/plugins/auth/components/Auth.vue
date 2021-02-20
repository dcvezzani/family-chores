<template>
  <span id="auth">
    <span v-if="!userIsLoggedIn"> | <router-link to="/login">Login</router-link> </span>
    <span v-if="userIsLoggedIn"> | <router-link to="/logout">Logout</router-link> </span>
  </span>
</template>

<script>
const { Cookies } = require('../cookies')

export default {
  name: 'Auth',
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


