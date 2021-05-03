<template>
  <FullPageLayout 
    :title="title"
    backLabel="retour à la liste des bénévoles"
    backTarget="/members"
    :preventNavigation="preventNavigation">

    <template v-if="!$subReady.members">
      <v-row class="d-flex justify-center">
          <v-progress-circular
            :size="50"
            indeterminate
            color="primary"
          />
      </v-row>
    </template>

    <template v-else>

      <v-form @submit.prevent="handleSubmit">
        <h3>Informations personnelles</h3>

        <v-row>
          <v-col>
            <v-text-field 
              label="Nom"
              v-model="member.infos.firstname" 
              outlined
              hide-details="auto"
            />
          </v-col>
          
          <v-col>
            <v-text-field 
              label="Prénom"
              v-model="member.infos.lastname" 
              outlined
              hide-details="auto"
            />
          </v-col>
          
          <v-col>
            <DateInput 
              label="Date de naisance"
              :date="member.infos.birthdate"
              :setDate="d => member.infos.birthdate = d"
              :startWithYear="true"
              />
          </v-col>
        </v-row>

        <v-row>
          <v-col :cols="8">
            <v-text-field 
              label="Email"
              v-model="member.infos.email"
              outlined
              hide-details="auto"
            />
          </v-col>
          
          <v-col :cols="4">
            <v-text-field 
              label="Téléphone"
              v-model="member.infos.phone" 
              outlined
              hide-details="auto"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col :cols="6">
            <v-text-field 
              label="Adresse"
              v-model="member.infos.address" 
              outlined
              hide-details="auto"
            />
          </v-col>
          
          <v-col :cols="2">
            <v-text-field 
              label="Code postal"
              v-model="member.infos.postCode" 
              outlined
              hide-details="auto"
            />
          </v-col>
          
          <v-col :cols="4">
            <v-text-field 
              label="Ville"
              v-model="member.infos.city" 
              outlined
              hide-details="auto"
            />
          </v-col>
        </v-row>


        <h3>Compétences</h3>
        <v-row>
          <v-col>
            <v-select
              label="Permis Bateau"
              v-model="member.abilities.boatLicense" 
              :items="choices.boatLicense"
              outlined
              hide-details="auto"
            />
          </v-col>
          <v-col>
            <v-select
              label="Capitaine"
              v-model="member.abilities.captain" 
              :items="choices.captain"
              outlined
              hide-details="auto"
            />
          </v-col>
          <v-col>
            <v-select
              label="Plongée"
              v-model="member.abilities.diving" 
              :items="choices.diving"
              outlined
              hide-details="auto"
            />
          </v-col>
          <v-col>
            <v-select
              label="Photographie"
              v-model="member.abilities.photo" 
              :items="choices.photo"
              outlined
              hide-details="auto"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-textarea 
              label="Commentaire"
              v-model="member.abilities.comment"
              outlined
              hide-details="auto" 
            />
          </v-col>
        </v-row>

        <h3>Adhésion</h3>
        <v-row>
          <v-col :cols="4">
            <DateInput 
              label="Date d'adhésion"
              :date="member.membership.date"
              :setDate="d => member.membership.date = d"
            />
          </v-col>

          <v-col :cols="4">
            <v-select
              label="Primo-adhésion"
              v-model="member.membership.isNewMember" 
              :items="choices.newMember"
              outlined
              hide-details="auto"
            />
          </v-col>
        </v-row>


        <h3>Carnets de sorties</h3>
        <h3>Sorties effectuées</h3>
        <h3>Sorties refusées</h3>


        <v-btn
          type="submit"
          color="primary"
          elevation="5"
          :loading="saving"
          :disabled="saving || modifiedProperties.length <= 0"
          rounded>
          enregistrer
        </v-btn>

        <MessageFlyout ref="flyout" />
      </v-form>


      <ul>
        <li v-for="p in modifiedProperties" :key="p.key">
          {{p.key}} : {{p.value}}
        </li>
      </ul>
    </template>

    <v-dialog
      v-model="showDialog"
      max-width="600"
    >
      <v-card>
        <v-card-title class="headline">
          Modifications non enregistrées
        </v-card-title>

        <v-card-text>
          Vous avez modifié des informations sur cet adhérent, mais n'avez pas enregistré
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="primary"
            text
            @click="forceGoBack"
          >
            Annuler ces modifications
          </v-btn>

          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="showDialog = false"
          >
            Rester sur la page
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </FullPageLayout>
</template>

<script>
import FullPageLayout from './FullPageLayout.vue';
import { Meteor } from 'meteor/meteor';
import { MembersCollection } from "../../db/MembersCollection";
import DateInput from './DateInput.vue';
import MessageFlyout from './MessageFlyout.vue';

export default {
  components: {
    FullPageLayout,
    DateInput,
    MessageFlyout
  },
  props: {
    id: String
  },
  data: () => ({
    saving: false,
    initialValues: undefined,
    showDialog: false,
    choices: {
      boatLicense: [
        "Non",
        "Côtier",
        "Hauturier"
      ],
      captain: [
        "Non",
        "Oui"
      ],
      diving: [
        "Aucun",
        ...[1,2,3,4,5].map(x => `Niveau ${x}`)
      ],
      photo: [
        "Amateur",
        "Amateur ++",
        "Professionnel"
      ],
      newMember: [
        "Non",
        "Oui"
      ]
    }
  }),
  computed: {
    title() {
      let title = "Bénévole";
      if (this.member && this.member.infos)
        title += ` : ${this.member.infos.firstname} ${this.member.infos.lastname}`;

      return title;
    },
    modifiedProperties() {
      if (!this.member || !this.initialValues)
        return [];

      let newValues = this.getAllProperties(this.member);

      return Object.keys(newValues).filter(k => {
        let newValue = newValues[k];
        let oldValue = this.initialValues[k]

        if (newValue && oldValue && typeof newValue.getTime === 'function') // Date comparison
          return newValue.getTime() !== oldValue.getTime();
        
        return newValue !== oldValue; // Standard types comparison
      })
      .map(k => ({key: k, value: newValues[k]}));
    }
  },
  methods: {
    preventNavigation() {
      if (this.modifiedProperties.length > 0) {
        this.showDialog = true;
        return true;
      }

      return false;
    },
    forceGoBack() {
      this.$router.push('/members');
      showDialog = false;
    },
    getAllProperties(m) {
        let properties = {};
        ['infos', 'abilities', 'membership'].forEach(rootKey => {
          Object.keys(m[rootKey]).forEach(key => properties[`${rootKey}.${key}`] = m[rootKey][key]);
        });
        return properties;
    },
    handleSubmit(event) {
      let changes = this.modifiedProperties;
      if (changes.length === 0) 
        return;

      this.saving = true;
      Meteor.call('members.updateProperties', 
        this.member._id, 
        changes,
        (error, result) => {
          if (error)
            console.log(error);

          this.$refs.flyout.open(!!error, error ? "Une erreur est survenue" : "Modification enregistrées !");

          setTimeout(() => this.saving = false, 500); // extra delay
        }
      );
    }
  },
  meteor: {
    $subscribe: {
      'members': []
    },
    member() {
      if (!this.id)
        return undefined;

      let foundMember = MembersCollection.findOne(this.id);

      // initialValues will allow to detect form modifications
      if (foundMember && !this.initialValues) {
        this.initialValues = this.getAllProperties(foundMember);
      }

      return foundMember;
    }
  }
}
</script>

<style scoped>
  h3 {
    color: var(--blue);
    margin: 10px 0;
  }
</style>