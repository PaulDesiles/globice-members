<template>
  <Card>
    <div class="content">
      <h1>Bénévoles et Sorties</h1>

      <form class="login-form" @submit.prevent="handleSubmit">      
        <input
            id="username"
            type="text"
            placeholder="identifiant"
            aria-label="identifiant"
            required
            v-model="username"
        />

        <input
            id="password"
            type="password"
            placeholder="mot de passe"
            aria-label="mot de passe"
            required
            v-model="password"
        />

        <button class="roundButton" type="submit">valider</button>
      </form>
    </div>
  </Card>
</template>

<script>
import { Meteor } from 'meteor/meteor';
import Card from './Card.vue';

export default {
  name: "Login",
  components: {
    Card
  },
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    handleSubmit(event) {
      Meteor.loginWithPassword(this.username, this.password);
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

  form {
    display: grid;
    grid-auto-rows: auto;
    justify-items: center;
    align-content: center;
    gap: 12px;
  }

  h1 { 
    color: white;
  }

  input {
    font-size: 12pt;
    padding: 6px 8px;
  }
</style>