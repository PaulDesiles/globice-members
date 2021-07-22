<template>
  <CardLayout>
    <div class="content">
      <h1>Bénévoles et Sorties</h1>

      <v-form class="login-form" @submit.prevent="handleSubmit">

        <v-text-field
          label="Identifiant"
          hide-details="auto"
          outlined
          dense
          dark
          required
          v-model="username"
          @change="dismissError"
        />

        <v-text-field
          label="Mot de passe"
          hide-details="auto"
          type="password"
          outlined
          dense
          dark
          required
          @change="dismissError"
          :error-messages="error ? ['mot de passe incorrect'] : []"
          v-model="password"
        />

        <v-btn
          type="submit"
          color="primary"
          elevation="5"
          rounded
          large
          :class="invalid() ? 'invalid-button' : 'valid-button'"
          :loading="loading"
        >valider</v-btn>
      </v-form>

      <v-snackbar
        v-model="showDemoHelper"
        :multi-line="true"
        :timeout="-1"
      >
        <p class="text-center ma-0">
          Hi github visitor ! Take a little tour with the demo credentials:
          <br />
          <span class="font-weight-bold">demo</span> // <span class="font-weight-bold">password</span>
        </p>
    </v-snackbar>
    </div>
  </CardLayout>
</template>

<script>
import { Meteor } from 'meteor/meteor';
import CardLayout from '../../components/CardLayout.vue';

export default {
  name: "Login",
  components: {
    CardLayout
  },
  data() {
    return {
      username: "",
      password: "",
      loading: false,
      error: false
    };
  },
  computed: {
    showDemoHelper() {
      return process.env.SHOW_DEMO_CREDENTIALS;
    }
  },
  methods: {
    handleSubmit(event) {
      if (!this.invalid()) {
        this.loading = true;
        Meteor.loginWithPassword(this.username, this.password, this.handleLoginResponse);
      }
    },
    handleLoginResponse(errors) {
      setTimeout(() => {
        this.loading = false;
        if (errors) {
          this.error = true;
        }
      }, 1000);
    },
    dismissError() {
      this.error = false;
    },
    invalid() {
      return this.error || !this.username || !this.password;
    }
  },
}
</script>

<style scoped>
  .content {
    display: grid;
    grid-template-rows: auto 1fr;
    justify-items: center;
    height: 100%;
  }

  .content h1 { 
    color: white;
  }
  
  form {
    display: grid;
    grid-auto-rows: auto;
    justify-items: center;
    align-content: center;
    gap: 12px;
  }


  .invalid-button {
    opacity: 0.7;
    cursor: default;
    pointer-events: none;
  }

</style>