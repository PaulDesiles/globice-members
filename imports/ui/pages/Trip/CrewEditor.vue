<template>
  <div>
    <v-dialog
      v-model="show"
      persistent
      max-width="1000"
      min-height="600"
    >
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
                  label="Role candidaté"
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
                      <TripCounter 
                        :trips="applicant._member.trips.confirmedTrips"
                        :currentTripId="currentTripId"
                        :isConfirmedList="true"
                        :memberId="applicant.memberId"
                      />
                    </td>
                    <td>
                      <TripCounter
                      :trips="applicant._member.trips.refusedTrips"
                      :currentTripId="currentTripId"
                      :isConfirmedList="false"
                      :memberId="applicant.memberId"
                    />
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
            @click="tryToCancel()"
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
    </v-dialog>
          
    <ConfirmationDialog 
      :show="showWarnDialog"
      title="Modifications non enregistrées"
      mainText="Vous avez modifié des informations sur l'équipage, mais ne les avez pas enregistré."
      cancelText="Rester sur la page"
      continueText="Annuler ces modifications"
      :cancelAction="() => showWarnDialog = false"
      :continueAction="() => { showWarnDialog = false; cancelChanges(); }"
    />
  </div>
</template>

<script>
import TripCounter from '../../components/TripCounter.vue';
import ConfirmationDialog from '../../components/ConfirmationDialog.vue';
import MemberCheck from './MemberCheck.vue';

import { Meteor } from 'meteor/meteor';
import { MembersCollection } from "../../../db/MembersCollection";

export default {
  props: {
    show: Boolean,
    applicants: Array,
    parameters: Object,
    currentTripId: String,
  },
  components: {
    TripCounter,
    ConfirmationDialog,
    MemberCheck,
  },
  data() {
    return {
      editableApplicants: JSON.parse(JSON.stringify(this.applicants)) || [],
      selectedMember: null,
      selectedRole: null,
      showWarnDialog: false
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
    tryToCancel() {
      if (JSON.stringify(this.applicants) !== JSON.stringify(this.editableApplicants)) {
        this.showWarnDialog = true;
      } else {
        this.cancelChanges();
      }
    },
    cancelChanges() {
      this.resetApplicants();
      this.$emit('close');
    },
    getCameraColor(photoAbility) {
      const index = this.parameters?.member.photo.map(x => x.value).indexOf(photoAbility);
      const color = this.parameters?.member.photoColors[index]?.value;
      return color || 'gray';
    }
  },
  meteor: {
    $subscribe: {
      'members': [],
    },
    members() {
      const list = MembersCollection.find({}).fetch();

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