<template>
  <v-hover v-slot="{ hover }">
    <v-btn
      color="primary"
      elevation="5"
      rounded
      :class="{'iconOnly':!hover}"
      @click="onClick"
    >
      <v-icon :left="hover">{{ icon }}</v-icon>
      <v-expand-x-transition>
        <span
          v-if="hover"
          class="transition-fast-in-fast-out"
        >
          {{ label }}
        </span>
    </v-expand-x-transition>
    </v-btn>
  </v-hover>
</template>

<script>
export default {
  props: {
    label: String,
    icon: String,
    onClick: {
      type: Function,
      default: () => {},
    }
  }
}
</script>

<style scoped>
  .v-btn.iconOnly {
    padding: 0;
    min-width: 36px;
  }
</style>