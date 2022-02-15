<template>
  <FullPageLayout 
    ref="layout"
    title="Entrées Hello Asso"
    backLabel="retour à la liste des bénévoles"
    backTarget="/members"
    :loading="!$subReady.parsedhelloasso || !$subReady.members">
    
    <h3><v-icon class="mr-2">mdi-clock-outline</v-icon>Entrées en attente</h3>
    <template v-if="entries && entries.length > 0">
      <v-expansion-panels multiple>
        <v-expansion-panel
          v-for="entry in entries"
          :key="entry.id"
          :class="entry.tmp_resolved ? 'resolveAnim' : ''"
        >
          <v-expansion-panel-header>
            <span>
              <span>{{ entry.computed.readableDate }}</span>
              <span> - </span>

              <span v-if="entry.computed.renewMembership">
                Adhésion
              </span>
              <span v-if="entry.computed.renewMembership && entry.computed.tripBooks">
                 et 
              </span>
              <span v-if="entry.computed.tripBooks">
                {{ entry.computed.tripBooks }} sorties
              </span>
            </span>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-alert
              v-if="entry.computed.errorLabel"
              border="left"
              colored-border
              type="error"
              elevation="2"
            >
              {{ entry.computed.errorLabel }}
            </v-alert>

            <v-btn v-else
              color="primary"
              elevation="5"
              rounded
              @click="handleEntry(entry)"
            >
              {{ entry.computed.actionLabel }}
            </v-btn>
            
            <v-btn
              color="secondary"
              elevation="5"
              rounded
              class="ml-2"
              @click="resolveEntry(entry)"
              title="si vous avez effectué l'action manuellement"
            >
              Marquer comme résolu
            </v-btn>

            <tree-view :data="entry" :options="{maxDepth: 0}" class="mt-4" />

          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>

    <h3 class="mt-6"><v-icon class="mr-2" color="green">mdi-check</v-icon>Entrées résolues</h3>
    <v-simple-table>
    <tr v-for="entry in resolvedEntries" :key="entry._id">
      <td class="pr-4">{{entry.readableDate}}</td>
      <td class="pr-4">{{entry._id}}</td>
      <td class="pa-1">
        <v-btn
          color="secondary"
          small
          rounded
          @click="reopenEntry(entry)"
        >
          marquer comme non résolu
        </v-btn>
      </td>
    </tr>
    </v-simple-table>
  </FullPageLayout>
</template>

<script>
import FullPageLayout from '../../components/FullPageLayout.vue';

import { Meteor } from 'meteor/meteor';
import { ParsedHelloAssoCollection } from "../../../db/ParsedHelloAssoCollection";
import { MembersCollection } from "../../../db/MembersCollection";
import { ParametersCollection } from "../../../db/ParametersCollection";
import { getMatchingMemberQuery } from '../../../commonHelpers/searchHelper';
import { serializeAsQueryParameters } from '../../helpers/uriHelper';
import { createMemberFromHelloAssoForm } from '../../helpers/memberHelper';

export default {
  components: {
    FullPageLayout
  },
  methods: {
    handleEntry(entry) {
      let memberId = entry.computed.member ? entry.computed.member._id : 'new';

      let editData = {
        back:'helloasso',
        helloAssoEntryId: entry._id,
        date: entry.sourceData.data.date,
        renewMembership: entry.parsedData.renewMembership ?? false,
        tripBooks: entry.parsedData.tripBooks ?? 0,
      };

      if (entry.parsedData.renewMembership) { // new or existing member
          
          let parsedMember = createMemberFromHelloAssoForm(
            entry.parsedData.membershipData,
            this.parameters
          );

          // only transmit abilities section if it's a new member
          let abilities = entry.computed.member ? {} : parsedMember.abilities;
          
          editData = {
            ...editData,
            ...parsedMember.infos,
            ...abilities
          };
      }

      let queryParameters = serializeAsQueryParameters(editData);

      this.$router.push(`/member/${memberId}?${queryParameters}`);
      return;
    },
    resolveEntry(entry) {
      entry.tmp_resolved = true; // triggers animation
      const resolveFunction = () => {
        Meteor.call('parsedhelloasso.resolve', entry.data.id, (error, result) => {
          if (error) {
            entry.tmp_resolved = false;
            this.$refs.layout.onSaveEnd(error, false);
          }
        });
      };
      setTimeout(resolveFunction, 500); // gives time from the animation to be visible
    },
    reopenEntry(entry) {
      Meteor.call('parsedhelloasso.reopen', entry._id);
    }
  },
  mounted: function () {
    Meteor.call('parsedhelloasso.parsenewentries');
  },
  meteor: {
    $subscribe: {
      'parsedhelloasso': [],
      'members': [],
      'parameters': []
    },
    parameters() {
      return ParametersCollection.findOne({});
    },
    entries() {
      return ParsedHelloAssoCollection.find({ resolved: false })
        .fetch()
        .map(e => {
          let actionLabel = '';
          let errorLabel = '';
          let member = undefined;

          if (!e.parsedData) {
              errorLabel = "les données ne correspondent pas au format attendu";
          } else {
            let memberInfos = {
              firstname: e.parsedData.memberInfos.firstName,
              lastname: e.parsedData.memberInfos.lastName
            };

            let query = getMatchingMemberQuery(memberInfos.firstName, memberInfos.lastName);
            member = MembersCollection.findOne(query);

            if (member) {
              memberInfos = {
                firstname: member.infos.firstname,
                lastname: member.infos.lastname
              };
            }

            if (e.parsedData.renewMembership) {
              if (member)
                actionLabel = `renouveler l'adhésion de ${memberInfos.firstname} ${memberInfos.lastname}`;
              else
                actionLabel = `ajouter le membre ${memberInfos.firstname} ${memberInfos.lastname}`;

              if (e.parsedData.tripBooks)
                actionLabel += ` + ${e.parsedData.tripBooks} sorties`;
            }
            else {
              if (member) {
                if (e.parsedData.tripBooks)
                  actionLabel = `ajouter ${e.parsedData.tripBooks} sorties à ${memberInfos.firstname} ${memberInfos.lastname}`;
                else
                  errorLabel = `impossible de trouver une action à effectuer`;  
              }
              else
                errorLabel = `impossible de trouver le membre ${memberInfos.firstname} ${memberInfos.lastname}`;
            }
          }

          return { 
            ...e, 
            computed : { 
              member,
              actionLabel,
              errorLabel,
              readableDate: (new Date(e.data.date)).toLocaleDateString('fr')
            }
          };
        });
    },
    resolvedEntries() {
      return ParsedHelloAssoCollection.find({ resolved: true })
        .fetch()
        .map(e => ({...e, readableDate: (new Date(e.data.date)).toLocaleDateString('fr') }));
    }
  }
};
</script>

<style scoped>
.v-data-table > .v-data-table__wrapper > table {
  width: auto;
}

.v-expansion-panel {
  transform-origin: 0, 0;
  transition: transform .5s, opacity .5s;
}

.resolveAnim {
  transform: translateX(100px);
  opacity: 0;
}
</style>