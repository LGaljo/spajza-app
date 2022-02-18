<template>
  <div class="col-2">
    <div v-for="(filter, key) of filters">
      <div
        class="mb-1 w-100"
        @click="filter.visible = !filter.visible"
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
            v-model="selected[key]"
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
            v-model="selected[key]"
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
        @click="resetSelected"
      >
        Počisti filtre
      </b-button>
    </div>
  </div>
</template>

<script>

export default {
  name: "sidebar",
  props: {
    filters: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      selected: {
        categories: null,
        tags: [],
        statuses: [],
      }
    }
  },
  watch: {
    selected: {
      deep: true,
      handler() {
        this.$emit('filterChange', this.selected)
      }
    }
  },
  computed: {
    showFilterClear() {
      return this.selected.categories || this.selected.tags.length || this.selected.statuses.length
    }
  },
  methods: {
    resetSelected() {
      this.$emit('clearFilter')
      this.selected = {
        categories: null,
        tags: [],
        statuses: []
      }
    },
    activeCategory(category) {
      return this.$route.query.category === category._id;
    },
  }
}
</script>

<style scoped>

</style>
