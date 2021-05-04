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
        <v-row>
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
          <v-col :cols="3">
            <v-select
              label="Role"
              v-model="selectedRole" 
              :items="roles"
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

      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Nom</th>
              <th class="text-left">Sorties</th>
              <th class="text-left">Refus</th>
              <th class="text-left">Rôle candidaté</th>
              <th class="text-left">Rôle alloué</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="applicant in editableApplicants"
              :key="applicant.member._id"
            >
              <td>
                <span :class="!!applicant.assignedRole ? 'selected-member' : 'unselected-member'">
                  {{ applicant.member.infos.firstname }} {{ applicant.member.infos.lastname }}
                </span>
              </td>
              <td>0/0</td>
              <td>0</td>
              <td>{{ applicant.desiredRole }}</td>
              <td>
                <v-select
                  label="Role"
                  v-model="applicant.assignedRole" 
                  :items="roles"
                  outlined
                  dense
                  solo
                  flat
                  hide-details="auto"
                />
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
        @click="$emit('close')"
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
import { Meteor } from 'meteor/meteor';
import { MembersCollection } from "../../db/MembersCollection";

export default {
  props: {
    applicants: Array
  },
  data: () => ({
    editableApplicants: this.applicants || [],
    roles: [ 
      { text:'aucun', value: null }, 
      'script', 
      'observateur', 
      'photographe' 
      ],
    selectedMember: null,
    selectedRole: null
  }),
  computed: {
    autocompleteItems() {
      return this.members
        ?.map(m => ({
          text: `${m.infos.firstname} ${m.infos.lastname}`,
          value: m
        }))
        || [];
    }
  },
  methods: {
    addApplicant() {
      this.editableApplicants.push({ 
        member: this.selectedMember,
        desiredRole: this.selectedRole,
        assignedRole: undefined
      });

      this.selectedMember = null;
      this.selectedRole = null;
    },
    saveChanges() {
      this.$emit('update:applicants', this.editableApplicants);
      this.$emit('close');
    }
  },
  meteor: {
    $subscribe: {
      'members': []
    },
    members() {
      return MembersCollection.find({}).fetch();
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
</style>