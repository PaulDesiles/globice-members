<template>

  <v-row>
    <v-col :cols="6">

      <template v-if="purchases.length > 0">

        <p><strong>{{ purchases.reduce((acc,p) => acc + p.size, 0) }}</strong> sorties achetées</p>

        <v-simple-table class="elevation-3 mb-5" >
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left" :style="{ width: '20%' }">Carnet</th>
                <th class="text-left" :style="{ width: '20%' }">Date d'achat</th>
                <th class="text-left" :style="{ width: '50%' }">Paiement</th>
                <th class="text-left" :style="{ width: '10%' }"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="purchase in orderedPurchases"
                :key="purchase.id"
              >
                <td>{{ purchase.size }} sorties</td>
                <td>{{ formatDate(purchase.date) }}</td>
                <td>{{ purchase.paymentInfos }}</td>
                <td>
                  <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn 
                        color="red"
                        icon
                        v-bind="attrs"
                        v-on="on"
                        @click="deletePurchase(purchase.id)"
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
      </template>

      <p v-else>Aucun carnet acheté</p>

      <v-btn 
        color="primary"
        elevation="5"
        rounded
        @click="showDialog = true"
      >
        <v-icon left>mdi-plus</v-icon>
        ajouter un carnet
      </v-btn>

    <v-dialog
        v-model="showDialog"
        max-width="600"
      >
        <v-card>
          <v-card-title class="headline">
            Nouveau carnet
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col>
              <v-select
                label="Taille de carnet"
                v-model="bookSize" 
                :items="bookSizeChoices"
                outlined
                hide-details="auto"
              />
              </v-col>
            </v-row>

            <v-row>
              <v-col>
              <DateInput 
                label="Date d'achat"
                :date.sync="paymentDate"
              />
              </v-col>
            </v-row>

            <v-row>
              <v-col>
              <v-text-field 
                label="Infos de paiement"
                v-model="paymentInfos" 
                outlined
                hide-details="auto"
              />
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-btn
              color="primary"
              text
              @click="hideAndResetDialog"
            >
              Annuler
            </v-btn>

            <v-spacer></v-spacer>

            <v-btn
              color="primary"
              @click="addPurchase"
            >
              Ajouter
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import DateInput from './DateInput.vue';
import { v4 as uuidv4 } from 'uuid';
import { sortDates, formatDate } from '../helpers/dateHelper';

export default {
  props: {
    purchases: Array,
  },
  components: {
    DateInput
  },
  data() {
    return {
      showDialog: false,
      bookSize: undefined,
      paymentDate: new Date(),
      paymentInfos: undefined,
      bookSizeChoices: [
        { text:'5 sorties', value: 5 }, 
        { text:'10 sorties', value: 10 }, 
      ]
    }
  },
  computed: {
    orderedPurchases() {
      return this.purchases.sort((x,y) => sortDates(x.date, y.date));
    }
  },
  methods: {
    formatDate,
    hideAndResetDialog() {
      this.showDialog = false;
      this.bookSize = undefined;
      this.paymentDate = undefined;
      this.paymentInfos = undefined;
    },
    addPurchase() {
      this.purchases.push({
        id: uuidv4(),
        size: this.bookSize,
        date: this.paymentDate,
        paymentInfos: this.paymentInfos
      });

      this.hideAndResetDialog();
    },
    deletePurchase(id) {
      this.$emit('update:purchases', this.purchases.filter(p => p.id !== id));
    }
  }
}
</script>