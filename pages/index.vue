<template>
  <b-container>
    <b-row class="mb-2">
      <div class="offset-md-3 col-md-6 text-center">
        <div class="input-group my-3">
          <input type="text" class="form-control" placeholder="Išči" v-model="searchQuery"
                 aria-describedby="basic-addon2" @keydown.enter="search">
          <div class="input-group-append" @click="search">
            <span class="input-group-text fake-button" id="basic-addon2">
              <span
                class="material-icons icon-button"
              >
                search
              </span>
            </span>
          </div>
        </div>
      </div>
    </b-row>
    <b-row>
      <sidebar
        class="col-md-2 col-12 mb-3"
        :filters="filters"
        @filterChange="onFilterChange"
      />
      <div class="col-md-10 col-12">
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col" v-if="hideOnMinWidth">Inv. št.</th>
              <th scope="col" v-if="hideOnMinWidth">Kat.</th>
              <th scope="col">Ime</th>
              <th scope="col">Število</th>
              <th scope="col">Stanje</th>
              <th scope="col" v-if="hideOnMinWidth">Značke</th>
            </tr>
          </thead>
          <tbody>
          <tr
            v-for="item of items"
            :key="item._id"
            @click="openDetails(item)"
          >
            <th v-if="hideOnMinWidth">{{ item.code }}</th>
            <th v-if="hideOnMinWidth"><b-badge variant="primary" class="m-1">{{ item.category.name }}</b-badge></th>
            <th>{{ item.name }}</th>
            <td>{{ item.count }}</td>
            <td><b-badge :variant="getVariantForStatus(item.status)">{{ getNameForStatus(item.status) }}</b-badge></td>
            <td v-if="hideOnMinWidth"><b-badge v-for="tag of item.tags" variant="secondary" :key="tag._id" class="m-1">{{ tag.name }}</b-badge></td>
          </tr>
          </tbody>
        </table>
      </div>
    </b-row>
  </b-container>
</template>

<script>
import status from "@/mixins/status";

export default {
  components: {},
  mixins: [status],
  data() {
    return {
      searchQuery: null,
      selected: {
        category: null,
        tags: null,
        statuses: null,
      },
      filters: {
        categories: {
          name: 'Kategorija',
          values: [],
          nameKey: 'name',
          valueKey: '_id',
          visible: false,
          type: 'single',
        },
        tags: {
          name: 'Značke',
          values: [],
          nameKey: 'name',
          valueKey: '_id',
          visible: false,
          type: 'multiple'
        },
        statuses: {
          name: 'Status',
          values: [],
          nameKey: 'text',
          valueKey: 'value',
          visible: false,
          type: 'multiple'
        },
      },
      items: [],
      innerWidth: 799,
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      this.innerWidth = window.innerWidth
    })
  },
  computed: {
    hideOnMinWidth() {
      return this.innerWidth > 800;
    },
  },
  methods: {
    async onFilterChange(event) {
      this.selected.category = event.categories
      this.selected.tags = event.tags
      this.selected.statuses = event.statuses
      await this.getItems()
    },
    async setCategory(category) {
      if (category._id === this.selected.category._id) {
        this.selected.category = {};
        const query = Object.assign({}, this.$route.query);
        delete query.category;
        await this.$router.replace({query});
      } else {
        this.selected.category = category
        const query = Object.assign({}, this.$route.query);
        query.category = category._id;
        await this.$router.replace({query});
      }
      await this.getItems()
    },
    async getItems() {
      this.$axios.$get(`/inventory`, {
        params: {
          category: this.selected.category,
          tags: this.selected.tags,
          statuses: this.selected.statuses,
          search: this.searchQuery
        }
      })
        .then(res => {
          this.items = res;
        })
        .catch(res => {
          console.error(res)
          this.$toast.error('Napaka pri pridobivanju podatkov', { duration: 10000 });
        })
    },
    async getCategories() {
      this.$axios.$get(`/categories`)
        .then(res => {
          if (res.length) {
            this.filters.categories.values.push(...res);
          }
        })
        .catch(res => {
          console.error(res)
          this.$toast.error('Napaka pri pridobivanju kategorij', { duration: 10000 });
        })
    },
    async getTags() {
      this.$axios.$get(`/tags`)
        .then(res => {
          if (res.length) {
            this.filters.tags.values.push(...res);
          }
        })
        .catch(res => {
          console.error(res)
          this.$toast.error('Napaka pri pridobivanju kategorij', { duration: 10000 });
        })
    },
    async openDetails(item) {
      await this.$router.push(`/item/${item._id}`)
    },
    async search() {
      await this.getItems()
    },
  },
  computed: {
  },
  async created() {
    if (this.$route.query.category) {
      this.selected.category._id = this.$route.query.category
    }
    if (this.$route.query.tag) {
      this.selected.tag = this.$route.query.tag
    }
    this.filters.statuses.values = this.statuses
    await Promise.all([
      this.getCategories(),
      this.getItems(),
      this.getTags(),
    ])
  }
}
</script>

<style lang="scss" scoped>
.fake-button:hover {
  background: #dcdee1;
  cursor: pointer;
}
</style>
