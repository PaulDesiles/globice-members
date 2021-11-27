<template>
  <FullPageLayout 
    ref="layout"
    :title="title"
    backLabel="retour à la liste des bénévoles"
    backTarget="/members"
    :hasUnsavedChanges="hasUnsavedChanges"
    :loading="!$subReady.members || !$subReady.parameters"
  >
    <template v-slot:header-right>
      <DeleteButton
        v-if="!newMember"
        entityLabel="ce bénévole"
        :onDelete="deleteMember"
      />
    </template>

    <template v-if="member && parameters">
      <v-form @submit.prevent="handleSubmit">
        <h3>Informations personnelles</h3>

        <v-row>
          <v-col>
            <ComparableTextField 
              label="Nom"
              :model.sync="member.infos.lastname"
              :initialValue="initialValues['infos.lastname']"
              :showInitialValue="!!editData"
            />
          </v-col>
          
          <v-col>
            <ComparableTextField 
              label="Prénom"
              :model.sync="member.infos.firstname"
              :initialValue="initialValues['infos.firstname']"
              :showInitialValue="!!editData"
            />
          </v-col>
          
          <v-col>
            <DateInput
              label="Date de naisance"
              :date.sync="member.infos.birthdate"
              :startWithYear="true"
              :initialValue="initialValues['infos.birthdate']"
              :showInitialValue="!!editData"
              />
          </v-col>
        </v-row>

        <v-row>
          <v-col :cols="8">
            <ComparableTextField 
              label="Email"
              :model.sync="member.infos.email"
              :initialValue="initialValues['infos.email']"
              :showInitialValue="!!editData"
            />
          </v-col>
          
          <v-col :cols="4">
            <ComparableTextField 
              label="Téléphone"
              :model.sync="member.infos.phone"
              :initialValue="initialValues['infos.phone']"
              :showInitialValue="!!editData"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col :cols="6">
            <ComparableTextField 
              label="Adresse"
              :model.sync="member.infos.address"
              :initialValue="initialValues['infos.address']"
              :showInitialValue="!!editData"
            />
          </v-col>
          
          <v-col :cols="2">
            <ComparableTextField 
              label="Code postal"
              :model.sync="member.infos.postCode"
              :initialValue="initialValues['infos.postCode']"
              :showInitialValue="!!editData"
            />
          </v-col>
          
          <v-col :cols="4">
            <ComparableTextField 
              label="Ville"
              :model.sync="member.infos.city"
              :initialValue="initialValues['infos.city']"
              :showInitialValue="!!editData"
            />
          </v-col>
        </v-row>


        <h3>Compétences</h3>
        <v-row>
          <v-col>
            <v-select
              label="Permis Bateau"
              v-model="member.abilities.boatLicense" 
              :items="parameters.member.boatLicense"
              outlined
              hide-details="auto"
            />
          </v-col>
          <v-col>
            <v-select
              label="Capitaine"
              v-model="member.abilities.captain" 
              :items="parameters.member.captain"
              outlined
              hide-details="auto"
            />
          </v-col>
          <v-col>
            <v-select
              label="Plongée"
              v-model="member.abilities.diving" 
              :items="parameters.member.diving"
              outlined
              hide-details="auto"
            />
          </v-col>
          <v-col>
            <v-select
              label="Photographie"
              v-model="member.abilities.photo" 
              :items="parameters.member.photo"
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
              :initialValue="initialValues['membership.date']"
              :showInitialValue="!!editData"
              />
          </v-col>

          <v-col :cols="3">
            <v-select
              label="Primo-adhésion"
              v-model="member.membership.isNewMember" 
              :items="parameters.member.newMember"
              outlined
              hide-details="auto"
            />
          </v-col>
        </v-row>


        <h3>Carnets de sorties</h3>
        <TripBooks 
          :memberId="member._id"
          :purchases.sync="member.trips.purchases"
          :confirmedTrips="member.trips.confirmedTrips"
          :parameters="parameters"
        />
        
        <h3>Sorties effectuées</h3>
        <TripList
          :trips="confirmedTrips"
          :memberId="id"
          :isConfirmedList="true"
        />

        <h3>Sorties refusées</h3>
        <TripList
          :trips="refusedTrips"
          :memberId="id"
          :isConfirmedList="false"
        />

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
import FullPageLayout from '../../components/FullPageLayout.vue';
import DateInput from '../../components/DateInput.vue';
import DeleteButton from '../../components/DeleteButton.vue';
import TripBooks from './TripBooks.vue';
import TripList from './TripList.vue';
import ComparableTextField from './ComparableTextField.vue';

import { Meteor } from 'meteor/meteor';
import { MembersCollection } from "../../../db/MembersCollection";
import { TripsCollection } from "../../../db/TripsCollection";
import { ParametersCollection } from "../../../db/ParametersCollection";
import { getAllProperties, getDelta } from '../../helpers/objectHelper';
import { v4 as uuidv4 } from 'uuid';

function fullfillTrips(summaryTrips, collection) {
  let fullTrips = [];

  const ids = summaryTrips
    .filter(t => !t.legacy)
    .map(t => t.id);

  if (ids.length > 0) {
    fullTrips = collection
      .find({ _id: { $in: ids }})
      .fetch();
  }

  return [
    ...summaryTrips.filter(t => t.legacy),
    ...fullTrips
  ];
}

function applyEditData(source, editData) {
  var output = {...source};
  var propNames = ['lastname', 'firstname', 'email', 'phone', 'address', 'postCode', 'city'];
  propNames.forEach(prop => {
    var value = editData[prop];
    if (value)
      output[prop] = value;
  });

  if (editData.birthdate) {
    var d = new Date(editData.birthdate);
    if (!isNaN(d.valueOf())) {
      output.birthdate = d;
    }
  }

  return output;
}


export default {
  components: {
    FullPageLayout,
    DateInput,
    DeleteButton,
    TripBooks,
    TripList,
    ComparableTextField,
  },
  props: {
    id: String,
    editData: Object
  },
  data: () => ({
    newMember: undefined,
    saving: false,
    initialValues: undefined
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

      let newValues = this.getAllFilteredProperties(this.member);

      return getDelta(newValues, this.initialValues)
        .map(k => ({key: k, value: newValues[k]}));
    },
    hasUnsavedChanges() {
      return this.modifiedProperties.length > 0;
    },
    canSave() {
      return this.hasUnsavedChanges &&
        !!this.member.infos.firstname &&
        !!this.member.infos.lastname &&
        !!this.member.infos.email;
    }
  },
  methods: {
    getAllFilteredProperties(member) {
      return getAllProperties(
            member,
            true,
            ['trips.confirmedTrips', 'trips.refusedTrips']
          );
    },
    handleSubmit(event) {
      let changes = this.modifiedProperties; // compute it only once
      if (changes.length === 0) 
        return;

      this.saving = true;

      const callback = (error, result) => {
        this.$refs.layout.onSaveEnd(error, !!this.newMember);
        setTimeout(() => this.saving = false, 500); // extra delay
        
        if (!error) {          
          this.initialValues = this.getAllFilteredProperties(this.member);
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
      'members': [],
      'parameters': [],
      'trips':[]
    },
    parameters() {
      return ParametersCollection.findOne({});
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
            trips: {
              purchases: [],
              confirmedTrips: [],
              refusedTrips: [],
            }
          };
          this.initialValues = [];
        }

        return this.newMember;
      }
      else {
        let foundMember = MembersCollection.findOne(this.id);

        if (foundMember) {
          if (!this.initialValues) {
            this.initialValues = this.getAllFilteredProperties(foundMember);
          }

          if (this.editData) {
            foundMember.infos = applyEditData(foundMember.infos, this.editData);

            var date = new Date(this.editData.date);
            if (isNaN(date.valueOf()))
              date = new Date();
            
            if (this.editData.renewMembership) {
              foundMember.membership.date = date;
              foundMember.membership.isNewMember = false;
            }
            
            if (this.editData.tripBooks) {
              foundMember.trips.purchases.push({
                id: uuidv4(),
                size: this.editData.tripBooks,
                date: date
              });
            }
          }
        }

        return foundMember;
      }
    },
    confirmedTrips() {
      if (this.member && this.member.trips.confirmedTrips) {
        return fullfillTrips(this.member.trips.confirmedTrips, TripsCollection);
      }

      return [];
    },
    refusedTrips() {
      if (this.member && this.member.trips.refusedTrips) {
        return fullfillTrips(this.member.trips.refusedTrips, TripsCollection);
      }

      return [];
    }
  }
}
</script>