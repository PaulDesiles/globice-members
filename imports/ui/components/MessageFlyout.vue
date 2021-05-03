<template>
  <v-snackbar
      v-model="isOpened"
      :timeout="timeout"
      :color="color"
    >
      {{ message }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          icon
          v-bind="attrs"
          @click="isOpened = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
</template>

<script>
  export default {
    data: () => ({
      message: '',
      color: 'success',
      isOpened: false,
      timeout: 2000,
    }),
    methods: {
      open(failed, message) {
        this.color = failed ? 'error' : 'success';
        this.message = message;
        this.isOpened = true;
      }
    }
  }
</script>