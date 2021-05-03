<template>
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
        :label="label"
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
      locale="fr-FR"
      v-model="pickerDate"
      :max="new Date().toISOString().substr(0, 10)"
      min="1920-01-01"
      @change="save"
    ></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  props: {
    label: String,
    date: Date,
    setDate: Function,
    startWithYear: Boolean
  },
  data: () => ({
    pickerDate: this.date,
    menu: false,
  }),
  watch: {
    menu (val) {
      this.startWithYear && val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
  },
  computed: {
    formatedBirthDate() {
      return this.formatDate(this.date) || '';
    }
  },
  methods: {
    save (d) {
      this.$refs.menu.save(d);
      this.setDate(new Date(d));
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
}
</script>

<style scoped>

</style>