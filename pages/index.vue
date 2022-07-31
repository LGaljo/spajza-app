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
        @clearFilter="searchQuery = null"
      />
      <div class="col-md-10 col-12">
        <RentDialog
          ref="dialog"
          @onRented="onItemRented"
        />

        <nuxt-link
          v-for="item of items"
          :to="`/item/${item._id}`" class="size"
          :key="item._id"
        >
          <ItemCard
            :item="item"
            class="item-card mb-3"
            @rent="onRentItem(item)"
          />
        </nuxt-link>

        <client-only>
          <infinite-loading
            spinner="spiral"
            @infinite="onInfiniteLoad"
          >
            <div slot="no-more">Konec seznama</div>
            <div slot="no-results">No results message</div>
          </infinite-loading>
        </client-only>

      </div>
    </b-row>
  </b-container>
</template>

<script>
import status from "@/mixins/status";
import {mapGetters} from "vuex";
import InfiniteLoading from 'vue-infinite-loading';
import ItemCard from "../components/ItemCard";
import sidebar from "../components/sidebar";
import RentDialog from "../components/RentDialog";

export default {
  components: { InfiniteLoading, ItemCard, sidebar, RentDialog },
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
      rentedItem: null,
      limit: 15,
      skip: 0,
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
  computed: {
    ...mapGetters({
      categories: 'categories/get',
      tags: 'tags/get',
    })
  },
  methods: {
    onInfiniteLoad($state) {
      this.$axios.$get(`/inventory`, {
        params: {
          category: this.selected.category,
          tags: this.selected.tags,
          statuses: this.selected.statuses,
          search: this.searchQuery,
          limit: this.limit + this.skip,
          skip: this.skip
        }
      })
      .then(response => {
        if (response.length) {
          this.items.push(...response)
          this.skip += this.limit
          $state.loaded();
        } else {
          $state.complete();
        }
      })
      .catch(reason => {
        console.error(reason)
      })
    },
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
    // await Promise.all([
    //   this.getItems(),
    // ])
    await Promise.all([
      this.$store.dispatch('categories/fetch'),
      this.$store.dispatch('tags/fetch'),
    ])

  }
}
</script>

<style lang="scss" scoped>
@import '../node_modules/bootstrap/scss/functions';
@import '../node_modules/bootstrap/scss/variables';
@import '../node_modules/bootstrap/scss/mixins';

@include media-breakpoint-up(xs) {
  .item-card {
    margin-bottom: 12px !important;
  }
}

@include media-breakpoint-up(lg) {
  .item-card {
    margin-bottom: 16px !important;
  }
}

.fake-button:hover {
  background: #dcdee1;
  cursor: pointer;
}

a {
  color: #212529;
}

a:hover {
  text-decoration: none !important;
}

</style>
