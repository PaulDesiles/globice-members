<template>
  <FullPageLayout 
    ref="layout"
    :title="title"
    :backLabel="backlabel"
    :backTarget="backtarget"
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
              :showInitialValue="hasEditData"
            />
          </v-col>
          
          <v-col>
            <ComparableTextField 
              label="Prénom"
              :model.sync="member.infos.firstname"
              :initialValue="initialValues['infos.firstname']"
              :showInitialValue="hasEditData"
            />
          </v-col>
          
          <v-col>
            <DateInput
              label="Date de naisance"
              :date.sync="member.infos.birthdate"
              :startWithYear="true"
              :initialValue="initialValues['infos.birthdate']"
              :showInitialValue="hasEditData"
              />
          </v-col>
        </v-row>

        <v-row>
          <v-col :cols="8">
            <ComparableTextField 
              label="Email"
              :model.sync="member.infos.email"
              :initialValue="initialValues['infos.email']"
              :showInitialValue="hasEditData"
            />
          </v-col>
          
          <v-col :cols="4">
            <ComparableTextField 
              label="Téléphone"
              :model.sync="member.infos.phone"
              :initialValue="initialValues['infos.phone']"
              :showInitialValue="hasEditData"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col :cols="6">
            <ComparableTextField 
              label="Adresse"
              :model.sync="member.infos.address"
              :initialValue="initialValues['infos.address']"
              :showInitialValue="hasEditData"
            />
          </v-col>
          
          <v-col :cols="2">
            <ComparableTextField 
              label="Code postal"
              :model.sync="member.infos.postCode"
              :initialValue="initialValues['infos.postCode']"
              :showInitialValue="hasEditData"
            />
          </v-col>
          
          <v-col :cols="4">
            <ComparableTextField 
              label="Ville"
              :model.sync="member.infos.city"
              :initialValue="initialValues['infos.city']"
              :showInitialValue="hasEditData"
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
              label="Adhésion en cours"
              :date.sync="member.membership.date"
              :initialValue="initialValues['membership.date']"
              :showInitialValue="hasEditData"
              />
          </v-col>

          <v-col :cols="2" style="align-self: center">
            <v-btn
              color="secondary"
              elevation="5"
              title="ajoute cette date à la liste des adhésion passées"
              @click="archiveMembershipDate"
            >
              Archiver
            </v-btn>
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

        <template v-if="previousMemberships && previousMemberships.length > 0">
          <h4>Adhésions passées</h4>
          <ul>
            <li v-for="membership in previousMemberships" :key="membership.key">
              {{membership.formatedDate}}
              <v-btn
                icon
                color="red"
                @click="removeMembershipDate(membership.date)"
              >
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>
            </li>
          </ul>
        </template>


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
import { applyEditData } from '../../helpers/memberHelper';
import { formatDate, ensureIsDate } from '../../helpers/dateHelper';

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
    query: Object
  },
  data: () => ({
    newMember: undefined,
    saving: false,
    initialValues: undefined
  }),
  computed: {
    editData() {
      if (!this.query)
        return undefined;

      const { back, ...editData } = this.query;
      return editData;
    },
    hasEditData() {
      return this.query && Object.keys(this.query).length > 1;
    },
    title() {
      if (this.newMember)
        return "Nouveau bénévole";
      if (this.member?.infos)
        return `Bénévole : ${this.member.infos.firstname} ${this.member.infos.lastname}`;

      return "Bénévole";
    },
    backToHelloAsso() {
      return this.query && this.query.back == 'helloasso';
    },
    backlabel() {
      return this.backToHelloAsso ? 'retour aux entrées HelloAsso' : 'retour à la liste des bénévoles';
    },
    backtarget() {
      return this.backToHelloAsso ? '/apidashboard' : '/members';
    },
    previousMemberships() {
      return this.member?.membership.previousMemberships
        ?.map(d => ensureIsDate(d))
        .sort((a,b) => a.getTime() - b.getTime())
        .map((d,i) => ({
          formatedDate: formatDate(d),
          date: d,
          key: `${d.getTime()} ${i}`
        }));
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
    archiveMembershipDate() {
      var date = this.member.membership.date;
      if (date) {
        this.member.membership = {
          ...this.member.membership,
          date: new Date(),
          previousMemberships: [...(this.member.membership.previousMemberships || []), date]
        };
      }
    },
    removeMembershipDate(date) {
      this.member.membership = {
        ...this.member.membership,
        previousMemberships : this.member.membership.previousMemberships.filter(x => x !== date)
      };
    },
    handleSubmit(event) {
      let changes = this.modifiedProperties; // compute it only once
      if (changes.length === 0) 
        return;

      this.saving = true;

      let callback = (error, result) => {
        this.$refs.layout.onSaveEnd(error, !!this.newMember);
        setTimeout(() => this.saving = false, 500); // extra delay
        
        if (!error) {
          this.initialValues = this.getAllFilteredProperties(this.member);
          
          const helloAssoEntryId = this.editData?.helloAssoEntryId;
          if (helloAssoEntryId && this.query.back) {
            Meteor.call('parsedhelloasso.resolve', helloAssoEntryId);
            this.$router.push({ query: { back: this.query.back }})
          }
        }
      };

      if (this.newMember)
        Meteor.call('members.create', this.member, callback);
      else
        Meteor.call('members.update', this.member._id, changes, callback);
    },
    deleteMember() {
      Meteor.call('members.delete', this.member._id, (error, result) => {
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

          this.newMember = applyEditData({
            infos: {
              birthdate: new Date()
            },
            abilities: {},
            membership: { 
              previousMemberships: []
            },
            trips: {
              purchases: [],
              confirmedTrips: [],
              refusedTrips: [],
            }
          }, this.editData);

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
          foundMember = applyEditData(foundMember, this.editData);
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