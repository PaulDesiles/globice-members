<template>
  <FullPageLayout 
    :title="Bénévole"
    backLabel="retour à la liste des bénévoles"
    backTarget="/members">
    
    <h2>{{ id }}</h2>
  </FullPageLayout>
</template>

<script>
import FullPageLayout from './FullPageLayout';

export default {
  components: {
    FullPageLayout
  },
  props: {
    id: String
  },
  data() {
    return {
      member: undefined
    };
  }
}
</script>