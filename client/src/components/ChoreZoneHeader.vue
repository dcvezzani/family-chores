<template>
  <div class="chore-zone-header">
    <div class="chore-row">
      <div class="zone-name">Zone</div>
      <div class="chore-progress chore-progress-header">
        <div>Week</div>
        <div class="chore-progress-header-weeks">
          <div v-for="index in 4" :key="index">{{index}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ChoreZoneHeader',
  components: { },
  props: ['xxx'],
  computed: {
  },
  methods: {
  },
  data() {
    return {}
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import '../assets/ChoreZone.css';

.chore-progress-header {
  display: flex;
  flex-direction: column;
  font-weight: 600;
}

.chore-progress-header div {
  margin-top: 10px;
}

.chore-progress-header-weeks {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}
</style>
