<template>
  <div class="container">
    <div class="cardContainer">
      <h1>{{ title }}</h1>
      <div class="card">
        <slot />
      </div>
      <slot name="below" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String
  }
}
</script>

<style scoped>

  h1 {
    color: black;
    text-align: center;
  }

  .container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template: 1fr 300px 1fr / 1fr 500px 1fr;
    color: white;
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