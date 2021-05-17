<template>
  <v-card>
    <v-card-title class="headline">
      Modification de l'équipage
    </v-card-title>

    <v-card-text>
      <p>
        Ajoutez tous les candidats à la sortie avec le rôle qu’ils se proposent d’occuper en cherchant leur nom ou adresse mail.
        <br />Une fois tous les candidats ajoutés, composez votre équipage en allouant un rôle aux candidats ciblés; ils apparaissent alors dans la liste de l’équipage. 
        <br />Un clic sur la ligne d’un candidat permet d’afficher tous les détails sur celui-ci, pour vous aider dans votre choix.
      </p>

      <h3>Candidats</h3>

      <v-form>
        <v-row class="align-center">
          <v-col :cols="6">
            <v-autocomplete
              v-model="selectedMember"
              :items="autocompleteItems"
              :loading="!$subReady.members"
              :disabled="!$subReady.members"
              color="primary"
              hide-no-data
              hide-selected
              label="Bénévole"
              placeholder="rechercher un bénévole"
              outlined
              hide-details="auto"
              autocomplete="new-password"
              :name="Math.random()"
            />
          </v-col>
          <v-col :cols="3" v-if="parameters">
            <v-select
              label="Role"
              v-model="selectedRole" 
              :items="parameters.trip.roles"
              outlined
              hide-details="auto"
            />
          </v-col>
          <v-col :cols="3">
            <v-btn
              color="primary"
              elevation="5"
              rounded
              large
              @click="addApplicant"
              :disabled="!selectedMember || !selectedRole"
            >
              ajouter
            </v-btn>
          </v-col>
        </v-row>
      </v-form>

      <v-simple-table class="mt-2">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left" :style="{ width: '20%' }">Nom</th>
              <th class="text-left" :style="{ width: '10%' }">Autorisé</th>
              <th class="text-left" :style="{ width: '10%' }">Sorties</th>
              <th class="text-left" :style="{ width: '10%' }">Refus</th>
              <th class="text-left" :style="{ width: '10%' }">Photo</th>
              <th class="text-left" :style="{ width: '15%' }">Rôle candidaté</th>
              <th class="text-left" :style="{ width: '20%' }">Rôle alloué</th>
              <th :style="{ width: '5%' }"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="applicant in editableApplicants"
              :key="applicant.memberId"
            >
              <td class="pa-0">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn 
                      text
                      block
                      class="notUpperCaseBtn"
                      :to="`/member/${ applicant.memberId }`"
                      target="_blank"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon left>mdi-account-details</v-icon>
                      <span :class="!!applicant.assignedRole ? 'selected-member' : 'unselected-member'">
                        {{ applicant.memberName }}
                      </span>
                      <v-spacer />
                    </v-btn>
                  </template>
                  <span>ouvrir la fiche bénévole</span>
                </v-tooltip>
              </td>
              <template  v-if="applicant._member">
                <td>
                  <MemberCheck :member="applicant._member" />
                </td>
                <td>
                  <TripCounter :trips="applicant._member.trips.confirmedTrips" />
                </td>
                <td>
                  <TripCounter :trips="applicant._member.trips.refusedTrips" />
                </td>
                <td>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon 
                        :color="getCameraColor(applicant._member.abilities.photo)"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-camera
                      </v-icon>
                    </template>
                    <span>{{ applicant._member.abilities.photo }}</span>
                  </v-tooltip>
                </td>
              </template>
              <template v-else>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </template>
              <td>{{ applicant.desiredRole }}</td>
              <td>
                <v-select
                  v-if="parameters"
                  label="Role"
                  v-model="applicant.assignedRole" 
                  :items="parameters.trip.roles"
                  outlined
                  dense
                  solo
                  flat
                  hide-details="auto"
                />
              </td>
              <td class="pa-0">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn 
                      color="red"
                      icon
                      v-bind="attrs"
                      v-on="on"
                      @click="deleteApplicant(applicant)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Supprimer</span>
                </v-tooltip>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <p v-if="editableApplicants.length === 0"><i>Aucun candidat n'a encore été ajouté</i></p>

    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        text
        @click="cancelChanges()"
      >
        annuler les changements
      </v-btn>
      <v-btn
        color="primary"
        elevation="5"
        @click="saveChanges()"
      >
        valider l'équipage
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import TripCounter from '../../components/TripCounter.vue';
import MemberCheck from './MemberCheck.vue';

import { Meteor } from 'meteor/meteor';
import { MembersCollection } from "../../../db/MembersCollection";

export default {
  props: {
    applicants: Array,
    parameters: Object,
  },
  components: {
    TripCounter,
    MemberCheck,
  },
  data() {
    return {
      editableApplicants: JSON.parse(JSON.stringify(this.applicants)) || [],
      selectedMember: null,
      selectedRole: null
    };
  },
  watch: {
    applicants() {
      this.resetApplicants();
    }
  },
  computed: {
    autocompleteItems() {
      return this.members
        ?.filter(m => !this.editableApplicants.some(a => a.memberId === m._id))
        ?.map(m => ({
          text: `${m.infos.firstname} ${m.infos.lastname}`,
          value: m
        }))
        || [];
    }
  },
  methods: {
    resetApplicants() {
      this.editableApplicants = JSON.parse(JSON.stringify(this.applicants)) || [];
    },
    addApplicant() {
      this.editableApplicants.push({ 
        memberId: this.selectedMember._id,
        memberName: `${this.selectedMember.infos.firstname} ${this.selectedMember.infos.lastname}`,
        memberEmail: this.selectedMember.infos.email,
        desiredRole: this.selectedRole,
        assignedRole: null,
        // temporary infos : will not be stored
        _member: this.selectedMember
      });

      this.selectedMember = null;
      this.selectedRole = null;
    },
    deleteApplicant(applicant) {
      this.editableApplicants = this.editableApplicants.filter(a => a !== applicant);
    },
    saveChanges() {
      this.$emit('update:applicants', this.editableApplicants);
      this.$emit('close');
    },
    cancelChanges() {
      this.resetApplicants();
      this.$emit('close');
    },
    getCameraColor(photoAbility) {
      if (!photoAbility)
        return 'gray';
      if (photoAbility === 'Amateur')
        return 'red'
      if (photoAbility === 'Amateur ++')
        return 'green'

      return 'blue';
    }
  },
  meteor: {
    $subscribe: {
      'members': [],
    },
    members() {
      const list = MembersCollection.find({}).fetch();

      // re-populate 'member' for previously added applicants
      if (list && list.length > 0 && this.editableApplicants) {
        this.editableApplicants
          .filter(a => !a._member)
          .forEach(a => {
            a._member = list.find(m => m._id === a.memberId);
          });
      }

      return list;
    }
  }
}
</script>

<style scoped>
  .unselected-member {
    color: black;
    font-weight: normal;
  }

  .selected-member {
    color: var(--blue);
    font-weight: bold;
  }

  .notUpperCaseBtn {
    text-transform: none !important;
  }
</style>