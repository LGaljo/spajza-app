<template>
  <div class="col-2">
    <div v-for="(filter, key) of filters">
      <div
        class="mb-1 w-100"
        @click="toggleFilter(key)"
      >
        <div
          class="d-flex flex-row justify-content-between py-2 cursor-pointer border-top"
          :class="{'border-bottom': filter.visible}"
        >
          <span>{{ filter.name }}</span>
          <span
            class="material-icons icon-button"
          >
            {{ filter.visible ? 'expand_more' : 'chevron_right' }}
          </span>
        </div>
        <b-collapse :visible="filter.visible">
          <b-form-checkbox-group
            v-if="filter.type === 'multiple'"
            :checked="selected[key]"
            @input="updateFilters({field: key, value: $event})"
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
            :checked="selected[key]"
            @input="updateFilters({field: key, value: $event})"
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
    <div v-if="showFilterClear">
      <b-button
        size="sm"
        variant="outline-info"
        class="w-100 my-1"
        @click="this.resetFilters"
      >
        Počisti filtre
      </b-button>
    </div>
  </div>
</template>

<script>

import {mapActions, mapGetters} from "vuex";

export default {
  name: "sidebar",
  props: {
    expandCategory: {
      type: Boolean,
      default: true,
    }
  },
  computed: {
    ...mapGetters({
      filters: 'item-list/filters',
      selected: 'item-list/selected',
    }),
    showFilterClear() {
      return this.selected?.category?.length || this.selected?.tags?.length || this.selected?.statuses?.length
    },
  },
  methods: {
    ...mapActions({
      updateFilters: 'item-list/updateFilters',
      toggleFilter: 'item-list/toggleFilter',
      resetFilters: 'item-list/resetFilters',
    }),
  }
}
</script>

<style scoped>

</style>
