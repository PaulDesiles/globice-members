<template>
  <FullPageLayout 
    :title="title"
    backLabel="retour à la liste des bénévoles"
    backTarget="/members">

    <template v-if="!$subReady.members">
      <v-row class="d-flex justify-center">
          <v-progress-circular
            :size="50"
            indeterminate
            color="primary"
          />
      </v-row>
    </template>

    <template v-else>

      <v-form>
        <h3>Informations personnelles</h3>

        <v-row>
          <v-col>
            <v-text-field 
              label="Nom"
              v-model="member.infos.firstname" 
              outlined
              hide-details="auto"
            />
          </v-col>
          
          <v-col>
            <v-text-field 
              label="Prénom"
              v-model="member.infos.lastname" 
              outlined
              hide-details="auto"
            />
          </v-col>
          
          <v-col>
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  label="Date de naisance"
                  v-model="formatedBirthDate"
                  outlined
                  hide-details="auto"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                ref="picker"
                v-model="date"
                :max="new Date().toISOString().substr(0, 10)"
                min="1920-01-01"
                @change="save"
              ></v-date-picker>
            </v-menu>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field 
              label="Email"
              v-model="member.infos.email"
              outlined
              hide-details="auto"
            />
          </v-col>
          
          <v-col>
            <v-text-field 
              label="Téléphone"
              v-model="member.infos.phone" 
              outlined
              hide-details="auto"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field 
              label="Adresse"
              v-model="member.infos.address" 
              outlined
              hide-details="auto"
            />
          </v-col>
          
          <v-col>
            <v-text-field 
              label="Code postal"
              v-model="member.infos.postCode" 
              outlined
              hide-details="auto"
            />
          </v-col>
          
          <v-col>
            <v-text-field 
              label="Ville"
              v-model="member.infos.city" 
              outlined
              hide-details="auto"
            />
          </v-col>
        </v-row>


          <h3>Compétences</h3>
          <h3>Adhésion</h3>
          <h3>Carnets de sorties</h3>
          <h3>Sorties effectuées</h3>
          <h3>Sorties refusées</h3>

      </v-form>
    </template>

  </FullPageLayout>
</template>

<script>
import FullPageLayout from './FullPageLayout.vue';
import { Meteor } from 'meteor/meteor';
import { MembersCollection } from "../../db/MembersCollection";

export default {
  components: {
    FullPageLayout
  },
  props: {
    id: String
  },
  data: () => ({
    date: null,
    menu: false,
  }),
  watch: {
    menu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
  },
  methods: {
    save (date) {
      this.$refs.menu.save(date);
      this.member.infos.birthdate = new Date(date);
    },
    formatDate(d) {
      return d?.toLocaleDateString(
        'fr-FR', 
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }
      );
    },
  },
  computed: {
    title() {
      let title = "Bénévole";
      if (this.member && this.member.infos)
        title += ` : ${this.member.infos.firstname} ${this.member.infos.lastname}`;

      return title;
    },
    formatedBirthDate() {
      return this.formatDate(this.member?.infos?.birthdate) || '';
    }
  },
  meteor: {
    $subscribe: {
      'members': []
    },
    member() {
      if (!this.id)
        return undefined;

      return MembersCollection.findOne(this.id);
    }
  }
}
</script>

<style scoped>
  h3 {
    color: var(--blue);
    margin: 10px 0;
  }
</style>