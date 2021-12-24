<template>

  <v-row>
    <v-col class="col-12 col-lg-6">

      <template v-if="purchases.length > 0">

        <p>
          <strong>{{ tripsBought }}</strong> sorties achetées
          : <strong>{{ tripsLeft }}</strong> restantes
        </p>

        <v-simple-table class="elevation-3 mb-5" >
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left" :style="{ width: '20%' }">Carnet</th>
                <th class="text-left" :style="{ width: '20%' }">Date d'achat</th>
                <th class="text-left" :style="{ width: '10%' }"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="purchase in orderedPurchases"
                :key="purchase.id"
                :class="purchase.autoAdded ? 'autoAdded' : ''"
              >
                <td>{{ purchase.size }} sorties</td>
                <td>{{ formatDate(purchase.date) }}</td>
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
            <!-- <v-row>
              <v-col>
              <v-select
                label="Taille de carnet"
                v-model="bookSize" 
                :items="parameters.member.bookSizeChoices"
                outlined
                hide-details="auto"
              />
              </v-col>
            </v-row> -->
            <v-row>
              <v-col md="auto">
                <v-radio-group v-model="bookSize" mandatory label="Taille de carnet">
                  <v-radio
                    v-for="n in parameters.member.bookSizeChoices"
                    :key="n.value"
                    :label="n.text"
                    :value="n.value"
                  />

                  <v-radio
                    label="autre taille"
                    :value="0"
                    class="mb-3"
                  />
                </v-radio-group>
              </v-col>
              <v-col align-self="end">
                <v-text-field 
                  outlined
                  dense
                  v-if="bookSize === 0"
                  suffix="sorties"
                  v-model="customBookSize"
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
              :disabled="!canAdd"
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
import DateInput from '../../components/DateInput.vue';
import { v4 as uuidv4 } from 'uuid';
import { sortDates, formatDate } from '../../helpers/dateHelper';
import { getTripsLeft, getTotalTripsBought } from '../../helpers/memberHelper';

export default {
  props: {
    memberId: String,
    purchases: Array,
    confirmedTrips: Array,
    parameters: Object
  },
  components: {
    DateInput
  },
  data() {
    return {
      showDialog: false,
      bookSize: undefined,
      paymentDate: new Date(),
      customBookSize: undefined
    }
  },
  computed: {
    orderedPurchases() {
      return this.purchases.sort((x,y) => sortDates(x.date, y.date));
    },
    finalBookSize() {
      if (this.bookSize !== undefined) {
        if (this.bookSize === 0) {
          let parsedSize = parseInt(this.customBookSize);
          if (parsedSize && !isNaN(parsedSize)) {
            return parsedSize;
          }
        } else {
          return this.bookSize;
        }
      }

      return undefined;
    },
    canAdd() {
      return this.finalBookSize && this.paymentDate;
    },
    tripsBought() {
      return getTotalTripsBought(this.purchases);
    },
    tripsLeft() {
      return getTripsLeft(this.memberId, this.purchases, this.confirmedTrips);
    }
  },
  methods: {
    formatDate,
    getTotalTripsBought,
    hideAndResetDialog() {
      this.showDialog = false;
      this.bookSize = undefined;
      this.customBookSize = undefined;
      this.paymentDate = new Date();
    },
    addPurchase() {
      if (this.canAdd) {
        this.purchases.push({
          id: uuidv4(),
          size: this.finalBookSize,
          date: this.paymentDate
        });

        this.hideAndResetDialog();
      }
    },
    deletePurchase(id) {
      this.$emit('update:purchases', this.purchases.filter(p => p.id !== id));
    }
  }
}
</script>

<style scoped>
.autoAdded {
  background: #ff91001c;
}
</style>