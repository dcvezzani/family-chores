<template>
  <div class="field form-checkbox">
    <div class="control">
      <label class="checkbox">
        <input type="checkbox" :checked="entry.completed"/>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Checkbox',
  props: ['entry'],
  computed: {
  }
}
</script>

