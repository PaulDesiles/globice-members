<template>
  <a v-if="external" :href="target" :class="linkClass" target="_blank">
    <img :src="imageSource" />
    <span>{{ label }}</span>
  </a>
  <router-link v-else :to="target">
    <img :src="imageSource" />
    <span>{{ label }}</span>
  </router-link>
</template>

<script>
export default {
  props: {
    target: String,
    label: String,
    image: String,
    external: Boolean
  },
  computed: {
    imageSource() {
      return '/img/' + (this.image || this.target) + '.jpg';
    },
    linkClass() {
      return this.target ? undefined : 'disabledButton';
    }
  }
}
</script>

<style scoped>
  .v-application a {
    color: white;
    text-decoration: none;
  }

  .v-application a img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 7px solid var(--blue);
    margin: 3px;
    box-shadow: 0 0 20px var(--blue-alpha50);
    transition: border .5s, box-shadow .5s;
  }

  .v-application a:hover img {
    border-color: var(--blue-hover);
    box-shadow: 0 0 20px var(--blue);
  }

  .v-application a span {
    display: block;
    text-align: center;
    font-size: 14pt;
  }

  .disabledButton {
    opacity: 0.6;
    pointer-events: none;
  }
</style>