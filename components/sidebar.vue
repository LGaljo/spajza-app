<template>
  <div class="col-2">
    <div v-for="(filter, key) of filters">
      <div class="mb-3">
        <b-button
          @click="filter.visible = !filter.visible"
          variant="outline-secondary"
          class="w-100 text-left"
        >
          <span>{{ filter.name }}</span>
<!--          <span-->
<!--            class="material-icons icon-button"-->
<!--          >-->
<!--            {{ filter.visible ? 'expand_more' : 'chevron_right' }}-->
<!--          </span>-->
        </b-button>
        <b-collapse v-model="filter.visible" >
          <b-form-checkbox-group
            v-if="filter.type === 'multiple'"
            v-model="selected[key]"
            class="ml-2 mt-2"
          >
            <b-form-checkbox
              v-for="value of filter.values"
              :key="value.name"
              :value="value._id"
            >
              {{ value.name }}
            </b-form-checkbox>
          </b-form-checkbox-group>
          <b-form-radio-group
            v-else
            v-model="selected[key]"
            class="ml-2 mt-2"
          >
            <b-form-radio
              v-for="value of filter.values"
              :key="value.name"
              :value="value._id"
            >
              {{ value.name }}
            </b-form-radio>
          </b-form-radio-group>
        </b-collapse>
      </div>
    </div>
    <div>
      <b-button
        size="sm"
        variant="outline-info"
        class="w-100 mt-4"
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
      selected: {}
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
  methods: {
    resetSelected() {
      this.selected = {
        categories: null,
        tags: []
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
