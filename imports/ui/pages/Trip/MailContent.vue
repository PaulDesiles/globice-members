<template>
  <v-card>
    <v-card-title class="headline">
      Contacer les candidats
    </v-card-title>

    <v-card-text>
      <p>Recopiez ces informations dans votre messagerie pour contacter votre équipage</p>
      <h3>
        <v-icon color="green darken-2" class="mb-1">mdi-checkbox-marked-circle</v-icon>
        Candidats Acceptés
      </h3>
      <v-row>
        <v-col>
          <v-text-field
            label="Destinataires"
            v-model="mailRecipients"
            outlined
            hide-details="auto"
            readonly
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-textarea
            label="Message"
            v-model="mailBody"
            outlined
            hide-details="auto"
            readonly
          />
        </v-col>
      </v-row>

      <h3 class="mt-8">
        <v-icon color="red darken-2" class="mb-1">mdi-minus-circle</v-icon>
        Candidats refusés
      </h3>
      <v-row>
        <v-col>
          <v-text-field
            label="Destinataires"
            v-model="refusedMailRecipients"
            outlined
            hide-details="auto"
            readonly
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-textarea
            label="Message"
            v-model="refusedMailBody"
            outlined
            hide-details="auto"
            readonly
          />
        </v-col>
      </v-row>
    </v-card-text>
    
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        text
        @click="close()"
      >
        fermer
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { formatDate } from '../../helpers/dateHelper';

function getRecipients(applicants) {
  return applicants
    ?.map(x => x._member?.infos.email || `<email de ${x.memberName}>`)
    .join(';');
}

function formatMail(mailBody, port, date) {
  return mailBody
    ?.replace('{PORT}', port)
    .replace('{DATE}', formatDate(date));
}

export default ({
  props: {
    acceptedApplicants: Array,
    refusedApplicants: Array,
    port: String,
    date: Date,
    parameters: Object,
  },
  methods: {
    close() {
      this.$emit('close');
    }
  },
  computed: {
    mailRecipients() {
      return getRecipients(this.acceptedApplicants);
    },
    mailBody() {
      return formatMail(this.parameters?.trip?.mailBody, this.port, this.date);
    },
    refusedMailRecipients() {
      return getRecipients(this.refusedApplicants);
    },
    refusedMailBody() {
      return formatMail(this.parameters?.trip?.refusedMailBody, this.port, this.date);
    }
  }
});
</script>
