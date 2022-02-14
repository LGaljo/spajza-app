<template>
  <b-container>
    <b-row class="my-2">
      <div class="offset-md-3 col-md-6 text-center">
        <div class="input-group my-3">
          <input type="text" class="form-control" placeholder="Išči" v-model="searchQuery"
                 aria-describedby="basic-addon2" @keydown.enter.prevent="search">
          <div class="input-group-append" @click.prevent="search">
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
        class="px-md-0 col-md-2 col-12 mb-3"
        :filters="filters"
        @filterChange="onFilterChange"
      />
      <div class="col-md-10 col-12">
        <ItemCard
          v-for="item of items"
          :key="item._id"
          :item="item"
          class="mb-4"
          @rent="onRentItem(item)"
        />
      </div>
      <RentDialog
        ref="dialog"
        @onRented="onItemRented"
      />
    </b-row>
  </b-container>
</template>

<script>
import status from "@/mixins/status";
import {mapGetters} from "vuex";

export default {
  components: {},
  mixins: [status],
  data() {
    return {
      searchQuery: null,
      viewType: 'cards',
      selected: {
        category: null,
        tags: null,
        statuses: null,
      },
      filters: {
        categories: {
          name: 'Kategorije',
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
      rentedItem: null,
    }
  },
  watch: {
    categories() {
      this.filters.categories.values = this.categories;
    },
    tags() {
      this.filters.tags.values = this.tags;
    },
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
    ...mapGetters({
      categories: 'categories/get',
      tags: 'tags/get',
    })
  },
  methods: {
    async openDetails(item) {
      await this.$router.push(`/item/${item._id}`)
    },
    async onFilterChange(event) {
      this.selected.category = event.categories
      this.selected.tags = event.tags
      this.selected.statuses = event.statuses
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
    async search() {
      await this.getItems()
    },
    onRentItem(item) {
      this.$refs.dialog.open(item);
    },
    onItemRented(item) {
      this.items.find(i => i._id === item._id).status = "BORROWED"
      this.$toast.success(`${item.name} uspešno izposojen`, { duration: 3000 });
    }
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
      this.getItems(),
    ])
    await Promise.all([
      this.$store.dispatch('categories/fetch'),
      this.$store.dispatch('tags/fetch'),
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
