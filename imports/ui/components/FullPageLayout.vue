<template>
  <v-container class="layoutRoot">
    <v-app-bar color="secondary" dark class="pl-4 pr-4">
      <h2>{{ title }}</h2>
      <div class="alignRight">
        <slot name="header-right">
        </slot>
      </div>
    </v-app-bar>
    <v-container>
      <v-col>
        <v-row class="mb-5" justify="space-between">
          <a
            class="backLink ml-2"
            :to="backTarget"
            event=""
            @click.prevent="goBack(false)"
          >
            <v-icon dense color="primary">
              mdi-arrow-left
            </v-icon>
            <span>{{ backLabel }}</span>
          </a>
          <v-col class="flex-grow-0 pa-0">
            <slot name="top-right">
            </slot>
          </v-col>
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

      <ConfirmationDialog 
        :show="showWarnDialog"
        title="Modifications non enregistrées"
        mainText="Vous avez modifié des informations sur cette page, mais ne les avez pas enregistré."
        cancelText="Rester sur la page"
        continueText="Annuler ces modifications"
        :cancelAction="() => showWarnDialog = false"
        :continueAction="() => goBack(true)"
      />
      
      <MessageFlyout ref="flyout" />
    </v-container>
  </v-container>
</template>

<script>
  import ConfirmationDialog from './ConfirmationDialog.vue';
  import MessageFlyout from './MessageFlyout.vue';

  export default {
    components: {
      MessageFlyout,
      ConfirmationDialog
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
      onSaveEnd(error, creation) {
        var isError = !!error;
        var message = "Modification enregistrées !";

        if (error) {
          if (error.error === "Not authorized")
            message = "Vous n'êtes pas autorisé à effectuer cette action";
          else
            message = "Une erreur est survenue";
        }

        this.$refs.flyout.open(isError, message);

        if (!isError && creation)
          setTimeout(() => this.goBack(true), 500);
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