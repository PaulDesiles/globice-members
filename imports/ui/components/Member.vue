<template>
  <FullPageLayout 
    ref="layout"
    :title="title"
    backLabel="retour à la liste des bénévoles"
    backTarget="/members"
    :hasUnsavedChanges="hasUnsavedChanges"
    :loading="!$subReady.members"
  >
  <template v-slot:header-right>
    <DeleteButton
      v-if="!newMember"
      entityLabel="ce bénévole"
      :onDelete="deleteMember"
    />
  </template>

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
            :date.sync="member.infos.birthdate"
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
        <v-col :cols="3">
          <DateInput 
            label="Date d'adhésion"
            :date.sync="member.membership.date"
          />
        </v-col>

        <v-col :cols="3">
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
      <TripBooks :purchases.sync="member.trips.purchases" />
      
      <h3>Sorties effectuées</h3>
      <h3>Sorties refusées</h3>

      <div class="d-flex justify-end">
        <v-btn
          type="submit"
          color="primary"
          elevation="7"
          :loading="saving"
          :disabled="saving || !canSave"
          rounded
          large
        >
          {{ !!newMember ? 'ajouter le bénévole' : 'enregistrer les modifications' }}
        </v-btn>
      </div>
    </v-form>
  </template>
  </FullPageLayout>
</template>

<script>
import FullPageLayout from './FullPageLayout.vue';
import DateInput from './DateInput.vue';
import DeleteButton from './DeleteButton.vue';
import TripBooks from './TripBooks';
import { Meteor } from 'meteor/meteor';
import { MembersCollection } from "../../db/MembersCollection";
import { getAllProperties, getDelta } from '../helpers/objectHelper';

export default {
  components: {
    FullPageLayout,
    DateInput,
    DeleteButton,
    TripBooks
  },
  props: {
    id: String
  },
  data: () => ({
    newMember: undefined,
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
      if (this.newMember)
        return "Nouveau bénévole";
      if (this.member?.infos)
        return `Bénévole : ${this.member.infos.firstname} ${this.member.infos.lastname}`;

      return "Bénévole";
    },
    modifiedProperties() {
      if (!this.member || !this.initialValues)
        return [];

      let newValues = getAllProperties(this.member, true);

      return getDelta(newValues, this.initialValues)
        .map(k => ({key: k, value: newValues[k]}));
    },
    hasUnsavedChanges() {
      return this.modifiedProperties.length > 0;
    },
    canSave() {
      return this.hasUnsavedChanges &&
        !!this.member.infos.firstname &&
        !!this.member.infos.lastname;
    }
  },
  methods: {
    handleSubmit(event) {
      let changes = this.modifiedProperties; // compute it only once
      if (changes.length === 0) 
        return;

      this.saving = true;

      const callback = (error, result) => {
        this.$refs.layout.onSaveEnd(error, !!this.newMember);
        setTimeout(() => this.saving = false, 500); // extra delay
        
        if (!error) {          
          this.initialValues = getAllProperties(this.member, true);
        }
      };

      if (this.newMember)
        Meteor.call('members.create', this.member, callback);
      else
        Meteor.call('members.update', this.member._id, changes, callback);
    },
    deleteMember() {
      Meteor.call('members.delete', this.member._id, (error, resul) => {
        this.$refs.layout.onSaveEnd(error, true);
      });
    }
  },
  meteor: {
    $subscribe: {
      'members': []
    },
    member() {
      if (!this.id)
        return undefined;

      if (this.id === 'new') {
        if (!this.newMember) {
          this.newMember = {
            infos: {
              birthdate: new Date()
            },
            abilities: {},
            membership: {
              date: new Date()
            },
            trips: {}
          };
          this.initialValues = [];
        }

        return this.newMember;
      }
      else {
        let foundMember = MembersCollection.findOne(this.id);

        if (foundMember && !this.initialValues) {
          this.initialValues = getAllProperties(foundMember, true);
        }

        return foundMember;
      }
    }
  }
}
</script>