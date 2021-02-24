<template>
  <div class="chore-work-sheet">
    <h2>Vezzani Chore Checklist</h2>
    <span v-if="user">Assigned to: {{user.name}}</span>
    
    <h1>{{zone.text}}</h1>

    <div class="columns">
      <div class="column">
        <ChoreZoneHeader></ChoreZoneHeader>
        <ChoreZone v-for="component in columnOneZones" :component="component"></ChoreZone>
      </div>
      <div class="column">
        <ChoreZoneHeader></ChoreZoneHeader>
        <ChoreZone v-for="component in columnTwoZones" :component="component"></ChoreZone>
      </div>
    </div>

  </div>
</template>

<script>
import { getUser } from '../plugins/auth'
ChoreZone
import ChoreZone from './ChoreZone.vue'
import ChoreZoneHeader from './ChoreZoneHeader.vue'

export default {
  name: 'ChoreWorkSheet',
  props: ['zone', 'zoneName'],
  components: { ChoreZone, ChoreZoneHeader, },
  computed: {
    columnOneZones: function() {
      return this.zone.zones.filter(entry => entry.column == 1)
    },
    columnTwoZones: function() {
      return this.zone.zones.filter(entry => entry.column == 2)
    },
  },
  data() {
    return {
      msg: 'Here is the chore zone worksheet',
      user: null,
    }
  },
  mounted() {
    this.user = getUser()
    console.log(">>>this.zone", this.zone)
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.columns .column div:first-child {
  margin-top: 1em;
  border-top: 1px solid silver;
}

h1 {
  font-weight: 800;
  font-size: 24pt;
}
h2 {
  font-weight: 600;
  font-size: 12pt;
}
</style>

