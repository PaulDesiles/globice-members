<template>
  <v-container class="layoutRoot">
    <v-app-bar color="secondary" dark>
      <h2>{{ title }}</h2>
      <div class="alignRight">
        <slot name="header-right">
        </slot>
      </div>
    </v-app-bar>
    <v-container>
      <v-col>
        <v-row class="mb-5">
          <router-link class="backLink" :to="backTarget">
            <v-icon dense color="primary">
              mdi-arrow-left
            </v-icon>
            <span>{{ backLabel }}</span>
          </router-link>
        </v-row>

        <slot></slot>
      </v-col>
    </v-container>
  </v-container>
</template>

<script>
  export default {
    props: {
      title: String,
      backLabel: String,
      backTarget: String
    }
  };
</script>

<style scoped>
  .layoutRoot {
    padding: 0;
    background: white;
    height: 100%;
    max-width: 1200px;
    box-shadow: 0 0 20px #0002;
  }

  .alignRight {
    position: absolute;
    right: 16px;
  }

  a.backLink {
    text-decoration: none;
  }

  a.backLink:hover span {
    text-decoration: underline;
  }
</style>