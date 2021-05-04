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
        v-model="formatedDate"
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
      :max="maxDate"
      :min="minDate"
      @change="save"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import { formatDate } from '../helpers/dateHelper';

export default {
  props: {
    label: String,
    date: Date,
    setDate: Function,
    startWithYear: Boolean,
    allowFuturDates: Boolean,
  },
  data() {
    var max = new Date();
    if (this.allowFuturDates)
      max.setFullYear(max.getFullYear() + 2);
    
    return {
      pickerDate: this.date.toISOString().substr(0, 10),
      menu: false,
      maxDate: max.toISOString().substr(0, 10),
      minDate: '1920-01-01'
    };
  },
  watch: {
    menu (val) {
      this.startWithYear && val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    },
  },
  computed: {
    formatedDate() {
      return formatDate(this.date) || '';
    }
  },
  methods: {
    save(d) {
      this.$refs.menu.save(d);
      this.setDate(new Date(d));
    }
  },
}
</script>

<style scoped>

</style>