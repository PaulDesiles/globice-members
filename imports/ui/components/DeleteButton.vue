<template>
  <div>
    <ExpandingButton
      label="supprimer"
      icon="mdi-delete"
      :onClick="() => showDialog = true"
    />
    
    <ConfirmationDialog 
      :show="showDialog"
      title="Suppression"
      :mainText="`Voulez-vous supprimer definitivement  ${ entityLabel } ?`"
      cancelText="Retour"
      continueText="Supprimer"
      :cancelAction="() => showDialog = false"
      :continueAction="() => { showDialog = false; onDelete(); }"
    />
  </div>
</template>

<script>
import ExpandingButton from './ExpandingButton.vue';
import ConfirmationDialog from './ConfirmationDialog.vue';

export default {
  props: {
    entityLabel: String,
    onDelete: Function,
  },
  components: {
    ExpandingButton,
    ConfirmationDialog
  },
  data() {
    return {
      showDialog: false
    };
  }
}
</script>