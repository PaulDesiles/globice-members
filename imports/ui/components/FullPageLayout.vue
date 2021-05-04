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
          <a
            class="backLink"
            :to="backTarget"
            event=""
            @click.prevent="goBack(false)"
          >
            <v-icon dense color="primary">
              mdi-arrow-left
            </v-icon>
            <span>{{ backLabel }}</span>
          </a>
        </v-row>

        <template v-if="loading">
          <v-row class="d-flex justify-center">
              <v-progress-circular
                :size="50"
                indeterminate
                color="primary"
              />
          </v-row>
        </template>
        <template v-else>
          <slot></slot>
        </template>
      </v-col>

      <v-dialog
        v-model="showWarnDialog"
        max-width="600"
      >
        <v-card>
          <v-card-title class="headline">
            Modifications non enregistrées
          </v-card-title>

          <v-card-text>
            Vous avez modifié des informations sur cette page, mais ne les avez pas enregistré.
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="primary"
              text
              @click="goBack(true)"
            >
              Annuler ces modifications
            </v-btn>

            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              @click="showWarnDialog = false"
            >
              Rester sur la page
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
      <MessageFlyout ref="flyout" />
    </v-container>
  </v-container>
</template>

<script>
  import MessageFlyout from './MessageFlyout.vue';

  export default {
    components: {
      MessageFlyout
    },
    props: {
      title: String,
      backLabel: String,
      backTarget: String,
      hasUnsavedChanges: Boolean,
      loading: Boolean
    },
    data: () => ({
      showWarnDialog: false,
    }),
    methods: {
      goBack(force) {
        if (force || this.canNavigate()) {
          this.$router.push(this.backTarget);
        }
      },
      canNavigate() {
        if (this.hasUnsavedChanges) {
          this.showWarnDialog = true;
          return false;
        }

        return true;
      },
      onSaveEnd(error) {
        if (error)
          console.log(error);

        this.$refs.flyout.open(!!error, error ? "Une erreur est survenue" : "Modification enregistrées !");
      }
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