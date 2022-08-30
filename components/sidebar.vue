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
        <b-collapse
          v-model="filters[key].visible"
        >
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

import {mapGetters} from "vuex";
import filters from "../mixins/filters";

export default {
  name: "sidebar",
  mixins: [filters],
  methods: {
    async resetSelected() {
      // await this.$store.dispatch('filters/unset');
      // await this.$store.commit('filters/clear_items');
      this.unset();
      await this.clear_items();
      // await this.$store.commit('filters/set_search', null);
      this.params.search = null;
      // await this.$store.dispatch('filters/fetch');
      await this.fetch();
    },
    async updateValue(value, key) {
      console.log(value, key)
      // await this.$store.commit('filters/set', { key, value })
      this.selected[key] = value
      // await this.$store.commit('filters/clear_items');
      await this.clear_items();
      // await this.$store.dispatch('filters/fetch');
      await this.fetch();
    },
    async changeVisibility(filter, key) {
      console.log(key)
      // await this.$store.commit('filters/set_visibility', key);
      this.filters[key].visible = !this.filters[key].visible
    }
  }
}
</script>

<style scoped>

</style>
