<template>
  <div class="backgroundContainer">
    <LazyImage v-if="showBackground" src="/img/background.jpg" />
    <div :class="containerClasses">
      <div class="cardContainer">
        <h1 class="cardTitle">{{ title }}</h1>
        <div class="card">
          <slot />
        </div>
        <slot name="below" />
      </div>
    </div>
  </div>
</template>

<script>
import LazyImage from './LazyImage.vue';

export default {
  components: {
    LazyImage
  },
  props: {
    title: String,
    large: Boolean,
    showBackground: Boolean
  },
  computed: {
    containerClasses() {
      let classes = ['container'];
      if (this.large)
        classes.push('large');
        
      return classes;
    }
  }
}
</script>

<style scoped>
  .backgroundContainer {
    width: 100%;
    height: 100%;
  }

  h1.cardTitle {
    color: black;
    text-align: center;
  }

  .container {
    position: relative;
    z-index: 1;

    width: 100%;
    height: 100%;
    display: grid;
    grid-template: 1fr 300px 1fr / 1fr 500px 1fr;
    color: white;
  }

  .container.large {
    grid-template: 1fr 300px 1fr / 1fr 600px 1fr;
  }

  .cardContainer {
    grid-column: 2/3;
    grid-row: 2/3;
    display: grid;
    grid-template-rows: auto 1fr;
  }

  .card {
    background: var(--dark-blue);
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0px 10px 20px 0px #00000040;
  }
</style>