<template>
  <v-text-field 
    :label="label"
    :value="model"
    @update:value="onValueChanged"
    outlined
    hide-details="auto"
    :class="className"
    :messages="messages"
  />
</template>

<script>
export default {
  props: {
    label: String,
    model: String,
    initialValue: String,
    showInitialValue: Boolean
  },
  computed: {
    isDifferent() {
      return this.showInitialValue && this.initialValue !== this.model;
    },
    className() {
      return this.isDifferent ? 'modified-field' : undefined;
    },
    messages() {
      return this.isDifferent ? 'ancienne valeur: ' + this.initialValue : undefined;
    }
  },
  methods:{
    onValueChanged(newValue) {
      this.$emit('update:model', newValue);
    }
  }
};

</script>

<style scoped>
.modified-field {
  background: #ff91001c;
}
</style>