<template>
  <Card title="Accueil">
    <div class="split-row">
      <MainButton target="members" label="Bénévoles" />
      <MainButton target="trips" label="Sorties" />
    </div>
  </Card>
</template>

<script>
import Card from './Card.vue';
import MainButton from './MainButton.vue';

export default {
  components: {
    Card,
    MainButton
  }
}
</script>

<style>
  .split-row {
    height: 100%;
    display: grid;
    grid-template-columns: auto auto;
    align-content: center;
    justify-content: space-evenly;
  }
</style>