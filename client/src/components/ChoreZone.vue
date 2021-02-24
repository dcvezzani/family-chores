<template>
  <div class="chore-zone">
    <div class="chore-row chore-zone-group">
      <div class="zone-name">{{component.text}}</div>
      <div class="chore-progress">
        <div v-for="week in component.weeks" :class="cellClass(week.name)">
          <Checkbox :entry="week"></Checkbox>
        </div>
      </div>
    </div>
    <div v-if="subZones.length > 0" v-for="subComponent in subZones" class="chore-row">
      <div class="zone-name">{{subComponent.text}}</div>
      <div class="chore-progress">
        <div v-for="entry in subComponent.progress" :class="cellClass(entry.name)">
          <Checkbox :entry="entry"></Checkbox>
        </div>
      </div>
    </div>
    <div v-if="subZones.length == 0" class="chore-row">
      <div class="zone-name"></div>
      <div class="chore-progress">
      </div>
    </div>
  </div>
</template>

<script>
import Checkbox from './form/Checkbox.vue'

export default {
  name: 'ChoreZone',
  components: { Checkbox, },
  props: ['xxx', 'checkboxCount', 'component'],
  computed: {
    subZones: function() {
      return this.component['sub-zones']
    }
  },
  methods: {
    progressCheckboxCount: function(type) {
      switch(type) {
        case "weekly": {
          return 4
          break
        }
        case "monthly": {
          return 1
          break
        }
        case "bi-monthly": {
          return 2
          break
        }
      }
    },
    cellClass: function(name) {
      return {cell: true, [`week-0${name}`]: true}
    },
  },
  data() {
    return {
      msg: 'This is a chore zone component',
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../assets/ChoreZone.css';
</style>
