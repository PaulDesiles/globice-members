<template>
  <CardLayout title="Accueil">
    <div class="split-row">
      <MainButton target="members" label="Bénévoles" />
      <MainButton target="trips" label="Sorties" />
    </div>
    <template slot="below">
      <div class="d-flex justify-end">
          <v-btn
            plain
            @click="$router.push('/parameters')"
          >
            <v-icon left>mdi-wrench-outline</v-icon>
            Paramètres
          </v-btn>
      </div>
    </template>
  </CardLayout>
</template>

<script>
import CardLayout from './CardLayout.vue';
import MainButton from './MainButton.vue';

export default {
  components: {
    CardLayout,
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