<template>
  <v-dialog
    v-model="show"
    max-width="600"
  >
    <v-card>
      <v-card-title class="headline">
        {{ title }}
      </v-card-title>

      <v-card-text>
        {{ mainText }}
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="primary"
          text
          @click="doContinue()"
        >
          {{ continueText }}
        </v-btn>

        <v-spacer></v-spacer>
        
        <v-btn
          color="primary"
          @click="doCancel()"
        >
          {{ cancelText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

  export default {
    props: {
      show: Boolean,
      title: String,
      mainText: String,
      cancelText: String,
      continueText: String,
      cancelAction: Function,
      continueAction: Function
    },
    methods: {
      doContinue() {
        this.continueAction();
      },
      doCancel() {
        this.cancelAction();
      }
    }
  };
</script>
