<template>
  <div class="col-2">
    <div v-for="(filter, key) of filters">
      <div
        class="mb-1 w-100"
        @click="changeVisibility(filter, key)"
      >
        <div :class="['d-flex', 'flex-row', 'justify-content-between', 'py-2', 'cursor-pointer', 'border-top', {'border-bottom': filter.visible}]">
          <span>{{ filter.name }}</span>
          <span
            class="material-icons icon-button"
          >
            {{ filter.visible ? 'expand_more' : 'chevron_right' }}
          </span>
        </div>
        <b-collapse v-model="filter.visible">
          <b-form-checkbox-group
            v-if="filter.type === 'multiple'"
            :value="selected[key]"
            @input="updateValue($event, key)"
            class="ml-2 mt-2 d-block"
          >
            <b-form-checkbox
              v-for="value of filter.values"
              :key="value[filter.nameKey]"
              :value="value[filter.valueKey]"
              class="d-block"
            >
              {{ value[filter.nameKey] }}
            </b-form-checkbox>
          </b-form-checkbox-group>
          <b-form-radio-group
            v-else
            :value="selected[key]"
            @input="updateValue($event, key)"
            class="ml-2 mt-2 d-block"
          >
            <b-form-radio
              v-for="value of filter.values"
              :key="value[filter.nameKey]"
              :value="value[filter.valueKey]"
              class="d-block"
            >
              {{ value[filter.nameKey] }}
            </b-form-radio>
          </b-form-radio-group>
        </b-collapse>
      </div>
    </div>
    <div v-if="isClear">
      <b-button
        size="sm"
        variant="outline-info"
        class="w-100 my-1"
        @click="resetSelected"
      >
        Počisti filtre
      </b-button>
    </div>
    <div>
    </div>
  </div>
</template>

<script>

import {mapGetters, mapState} from "vuex";

export default {
  name: "sidebar",
  computed: {
    ...mapGetters({
      selected: 'filters/get_selected',
      filters: 'filters/get_filters',
      isClear: 'filters/is_clear',
    }),
    ...mapState({
      selectedMapped: 'filters/selected',
   }),
  },
  // data() {
  //   return {
  //   }
  // },
  // watch: {
  //   selectedMapped: {
  //     deep: true,
  //     async handler() {
  //       console.log('change')
  //       this.showFilterClear = true
  //     }
  //   }
  // },
  methods: {
    async resetSelected() {
      this.$emit('clearFilter')
      await this.$store.dispatch('filters/unset');
    },
    async updateValue(value, key) {
      await this.$store.commit('filters/set', { key, value })
    },
    async changeVisibility(filter, key) {
      await this.$store.commit('filters/set_visibility', key);
    }
  }
}
</script>

<style scoped>

</style>
