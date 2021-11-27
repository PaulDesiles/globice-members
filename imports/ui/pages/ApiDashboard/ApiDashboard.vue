<template>
  <FullPageLayout 
    title="Entrées Hello Asso"
    backLabel="retour à la liste des bénévoles"
    backTarget="/members"
    :loading="!$subReady.helloasso || !$subReady.members">

    <template v-if="entries && entries.length > 0">
      <v-expansion-panels multiple>
        <v-expansion-panel
          v-for="entry in entries"
          :key="entry.id"
        >
          <v-expansion-panel-header :class="ignoreEntry(entry) ? 'ignoredEntry' : undefined">
            <span>

              <v-icon v-if="entry.computed.handled" color="green">mdi-check</v-icon>
              <template v-else>
                <v-icon v-if="entry.computed.errorLabel" color="red">mdi-alert</v-icon>
                <v-icon v-else>mdi-clock-outline</v-icon>
              </template>
              
              <span class="ml-2">{{ entry.computed.readableDate }}</span>
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
  </FullPageLayout>
</template>

<script>
import FullPageLayout from '../../components/FullPageLayout.vue';

import { Meteor } from 'meteor/meteor';
import { HelloAssoCollection } from "../../../db/HelloAssoCollection";
import { MembersCollection } from "../../../db/MembersCollection";
import { getMatchingMemberQuery } from '../../../commonHelpers/searchHelper';

const analyseEntry = (data, encounteredIds) => {
  if (encounteredIds.includes(data.id))
    return { isDuplicate: true };
  
  encounteredIds.push(data.id);
  
  if (data.formType === 'PaymentForm') {
    if (data.formSlug.startsWith('carte-5'))
      return { tripBooks: 5 };

    if (data.formSlug.startsWith('carte-10'));
      return { tripBooks: 10 };
  } 
  else if (data.formType === 'Membership') {
    let tripBooks = 0;
    let options = data.items
      .map(i => i.options)
      .flat()
      .filter(o => o);

    if (options.some(o => o.name.startsWith('Carte de 5')))
      tripBooks = 5;
    else if (options.some(o => o.name.startsWith('Carte de 10')))
      tripBooks = 10;

    return {
      renewMembership: true,
      tripBooks
    };
  }

  return { unknownType: true };
};

export default {
  components: {
    FullPageLayout
  },
  methods: {
    ignoreEntry(entry) {
      return entry.computed.hasIgnoredState || entry.computed.isDuplicate; 
    },
    handleEntry(entry) {

      return;
    },
    resolveEntry(entry) {
      return;
    }
  },
  meteor: {
    $subscribe: {
      'helloasso': [],
      'members': []
    },
    entries() {
      let encounteredIds = [];

      return HelloAssoCollection.find({ eventType: 'Order' })
        .fetch()
        .map(e => {
          let computed = analyseEntry(e.data, encounteredIds);
          let query = getMatchingMemberQuery(e.data.payer.firstName, e.data.payer.lastName);
          let member = MembersCollection.findOne(query);

          let actionLabel = '';
          let errorLabel;
          if (computed.renewMembership) {
            if (member) {
              actionLabel = `renouveler l'adhésion de ${member.infos.firstname} ${member.infos.lastname}`;
              if (computed.tripBooks)
                actionLabel += ` + ${computed.tripBooks} sorties`;
            }
            else
              actionLabel = `ajouter le membre ${e.data.payer.firstName} ${e.data.payer.lastName}`;
          } else {
            if (member) {
              if (computed.tripBooks)
                actionLabel = `ajouter ${computed.tripBooks} sorties à ${member.infos.firstname} ${member.infos.lastname}`;
              else
                errorLabel = `impossible de trouver une action à effectuer`;  
            }
            else
              errorLabel = `impossible de trouver le membre ${e.data.payer.firstName} ${e.data.payer.lastName}`;
          }

          return { 
            ...e, 
            computed : { 
              ...computed,
              member,
              actionLabel,
              errorLabel,
              readableDate: (new Date(e.data.date)).toLocaleDateString('fr')
            }
          };
        })
        .filter(e => !e.computed.isDuplicate);
        // .sort((a,b) => new Date(b.data.date) - new Date(a.data.date)); // last entries first
    }
  }
};
</script>

<style>
.ignoredEntry {
  opacity: 0.2;
}
</style>