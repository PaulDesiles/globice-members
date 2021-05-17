<template>
  <div>
    <ExpandingButton
      label="supprimer"
      icon="mdi-delete"
      :onClick="() => showDialog = true"
    />
    <v-dialog
        v-model="showDialog"
        max-width="600"
    >
      <v-card>
        <v-card-title class="headline">
          Suppression
        </v-card-title>

        <v-card-text>
          Voulez-vous supprimer definitivement {{ entityLabel }} ?
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="primary"
            text
            @click="showDialog = false"
          >
            Retour
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn
            color="primary"
            @click="() => { showDialog = false; onDelete(); }"
          >
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ExpandingButton from './ExpandingButton.vue';

export default {
  props: {
    entityLabel: String,
    onDelete: Function,
  },
  components: {
    ExpandingButton
  },
  data() {
    return {
      showDialog: false
    };
  }
}
</script>