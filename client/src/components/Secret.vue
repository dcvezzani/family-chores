<template>
  <div class="secret">
    <h1>{{ msg }}</h1>
    <div v-if="user">{{user.name}}</div>
  </div>
</template>

<script>
import { getUser } from '../plugins/auth'

export default {
  name: 'Secret',
  data() {
    return {
      msg: 'this is secret',
      user: null,
    }
  },
  mounted() {
    this.user = getUser()
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
