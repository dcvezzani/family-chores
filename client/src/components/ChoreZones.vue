<template>
  <div class="chore-zones">
    <h1>{{ msg }}</h1>
    <div v-if="user">{{user.name}}, here are the available chore zones</div>
    <ul>
      <li v-for="( entry, index ) in zones" :key="index">
        <router-link :to="{ name: 'ChoreWorkSheet', params: { zone: entry } }">{{entry}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { getUser } from '../plugins/auth'

export default {
  name: 'ChoreZones',
  props: ['zones'],
  data() {
    return {
      msg: 'Here are the Chore Zones that you can manage',
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
