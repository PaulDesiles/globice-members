<template>
  <FullPageLayout 
    ref="layout"
    :title="title"
    backLabel="retour à la liste des bénévoles"
    backTarget="/members"
    :hasUnsavedChanges="hasUnsavedChanges"
    :loading="!$subReady.members"
  >

  <template v-if="member">
    <v-form @submit.prevent="handleSubmit">
      <h3>Informations personnelles</h3>

      <v-row>
        <v-col>
          <v-text-field 
            label="Nom"
            v-model="member.infos.lastname" 
            outlined
            hide-details="auto"
          />
        </v-col>
        
        <v-col>
          <v-text-field 
            label="Prénom"
            v-model="member.infos.firstname" 
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
        :disabled="saving || !hasUnsavedChanges"
        rounded
      >
        enregistrer les modifications
      </v-btn>
    </v-form>


    <ul>
      <li v-for="p in modifiedProperties" :key="p.key">
        {{p.key}} : {{p.value}}
      </li>
    </ul>
  </template>
  </FullPageLayout>
</template>

<script>
import FullPageLayout from './FullPageLayout.vue';
import DateInput from './DateInput.vue';
import { Meteor } from 'meteor/meteor';
import { MembersCollection } from "../../db/MembersCollection";
import { getDelta } from '../helpers/objectHelper';

export default {
  components: {
    FullPageLayout,
    DateInput
  },
  props: {
    id: String
  },
  data: () => ({
    saving: false,
    initialValues: undefined,
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
      if (this.member?.infos)
        title += ` : ${this.member.infos.firstname} ${this.member.infos.lastname}`;

      return title;
    },
    modifiedProperties() {
      if (!this.member || !this.initialValues)
        return [];

      let newValues = this.getAllProperties(this.member);

      return getDelta(newValues, this.initialValues)
        .map(k => ({key: k, value: newValues[k]}));
    },
    hasUnsavedChanges() {
      return this.modifiedProperties.length > 0;
    }
  },
  methods: {
    getAllProperties(m) {
        let properties = {};

        if (m) {
          ['infos', 'abilities', 'membership'].forEach(rootKey => {
            Object.keys(m[rootKey]).forEach(key => properties[`${rootKey}.${key}`] = m[rootKey][key]);
          });
        }
        return properties;
    },
    handleSubmit(event) {
      let changes = this.modifiedProperties;
      if (changes.length === 0) 
        return;

      this.saving = true;
      Meteor.call('members.update', 
        this.member._id, 
        changes,
        (error) => {
          this.$refs.layout.onSaveEnd(error);
          setTimeout(() => this.saving = false, 500); // extra delay
          
          if (!error)
            this.initialValues = this.getAllProperties(foundTrip);
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