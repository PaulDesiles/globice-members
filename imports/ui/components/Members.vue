<template>
  <FullPageLayout 
    title="Members"
    backLabel="retour à l'accueil"
    backTarget="/">
    <template v-slot:header-right>
      <span>Search</span>
    </template>

    <span>content</span>
  </FullPageLayout>
</template>

<script>
import FullPageLayout from './FullPageLayout.vue';

export default {
  components: {
    FullPageLayout
  }
};
</script>