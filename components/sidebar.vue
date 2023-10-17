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
            v-model="value[key]"
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
            v-model="value[key]"
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
    },
    value: {
      type: Object,
    }
  },
  data() {
    return {
    }
  },
  watch: {
    value: {
      deep: true,
      handler() {
        this.$emit('change')
      }
    }
  },
  computed: {
    showFilterClear() {
      return this.value?.category?.length || this.value?.tags?.length || this.value?.statuses?.length
    }
  },
  methods: {
    resetSelected() {
      this.$emit('input', {
        category: [],
        tags: [],
        statuses: []
      })
      this.$emit('change')
    },
    // activeCategory(category) {
    //   return this.$route.query.category === category._id;
    // },
  }
}
</script>

<style scoped>

</style>
