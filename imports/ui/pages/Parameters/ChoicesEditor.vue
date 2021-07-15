<template>
  <v-card max-width="400" color="#eee" :elevation="3" class="card-container mx-2 my-2">
    <v-card-title>
      {{ title }}
    </v-card-title>
    <v-card-text>
      <v-hover
        v-for="choice in value" :key="choice.value"
        v-slot="{ hover }"
      >
        <v-row no-gutters class="align-center" :style="{ background: hover ? '#9991' : 'transparent' }">
          <v-col class="flex-grow-1 flex-shrink-0 pl-2">
            {{ choice.text }}
          </v-col>
          <v-col class="flex-grow-0 flex-shrink-1">
            <v-btn
              icon
              color="red"
              @click="deleteChoice(choice)"
              :disabled="!choice.value"
            >
              <v-icon>
                mdi-delete
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-hover>
    </v-card-text>
    <v-card-actions class="card-actions">
      <v-row no-gutters class="mt-2">
        <v-col class="flex-grow-1 flex-shrink-0">
          <v-text-field
            v-if="integerValues"
            outlined
            dense
            hide-details="auto"
            v-model="newValue"
            type="number"
            :min="1"
            :step="1"
          />
          <v-text-field
            v-else
            outlined
            dense
            hide-details="auto"
            v-model="newValue"
          />
        </v-col>
        <v-col class="flex-grow-0 flex-shrink-1 ml-3">
          <v-btn
            @click="addChoice()"
            :disabled="!canAdd"
          >
            ajouter
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    title: String,
    value: Array,
    integerValues: Boolean,
    labelGetter: {
      type: Function,
      default: (x) => x
    }
  },
  data() {
    return {
      newValue: '',
    };
  },
  computed: {
    canAdd() {
      return this.newValue !== undefined && this.newValue.trim().length > 0;
    }
  },
  methods: {
    deleteChoice(choice) {
      this.$emit('input', this.value.filter(c => c!== choice));
    },
    addChoice() {
      if (this.canAdd)
      {
        this.$emit('input', [...this.value, {
          text: this.labelGetter(this.newValue),
          value: this.integerValues ? parseInt(this.newValue) : this.newValue
        }]);
        this.newValue = '';
      }
    }
  }
}
</script>

<style scoped>
  .card-container {
    position: relative;
    padding-bottom: 40px;
    width: 400px;
  }
  .card-actions {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>