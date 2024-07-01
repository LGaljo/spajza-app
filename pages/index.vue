<template>
  <b-container>
    <b-row class="my-2">
      <b-form class="offset-md-3 col-md-6 text-center">
        <b-input-group class="mt-3">
          <!-- Search box -->
          <b-form-input
            type="text"
            :value="search"
            @input="setSearch"
            placeholder="Išči"
            aria-describedby="basic-addon2"
            @keydown.enter.prevent="updateFilters({field: 'search', value: search})"
          />
          <div class="input-group-append" @click.prevent="updateFilters({field: 'search', value: search})">
            <span class="input-group-text fake-button" id="basic-addon2">
              <span class="material-icons icon-button">
                search
              </span>
            </span>
          </div>
        </b-input-group>
      </b-form>
    </b-row>

    <!-- Sort boxes -->
    <b-row class="my-3">
      <b-col class="col-12 col-md-4 offset-md-8 col-lg-3 offset-lg-9">
        <div class="d-flex flex-row justify-content-end">
          <b-form-select
            :value="sort.field"
            :options="sort.options"
            no-caret
            size="sm"
            class="mr-2"
            @input="onSortUpdate({'field': $event})"
          />
          <b-button
            v-if="sort.dir === 'asc'"
            size="sm"
            variant="light"
            @click="onSortUpdate({dir: 'desc'})"
            style="width: 40px;"
          >
            <b-icon-arrow-up/>
          </b-button>
          <b-button
            v-else
            size="sm"
            variant="light"
            @click="onSortUpdate({dir: 'asc'})"
            style="width: 40px;"
          >
            <b-icon-arrow-down/>
          </b-button>
        </div>
      </b-col>
    </b-row>

    <b-row>
      <!-- Sidebar filters -->
      <sidebar class="px-md-0 col-md-2 col-12 mb-3" expand-category @reset="resetInfLoader" />

      <!-- List -->
      <div class="col-md-10 col-12">
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

        <infinite-loading
          spinner="spiral"
          @infinite="onInfiniteLoad"
          :identifier="infiniteId"
        >
          <div slot="no-more">Konec seznama</div>
          <div slot="no-results">Ni rezultatov iskanja</div>
        </infinite-loading>
      </div>
    </b-row>

    <RentDialog ref="dialog" />
  </b-container>
</template>

<script>
import status from "@/mixins/status";
import {mapActions, mapGetters} from "vuex";
import InfiniteLoading from 'vue-infinite-loading';
import ItemCard from "../components/ItemCard";
import sidebar from "../components/sidebar";
import RentDialog from "../components/modals/RentDialog";

export default {
  name: 'Home',
  components: { InfiniteLoading, ItemCard, sidebar, RentDialog },
  mixins: [status],
  data: () => ({
    infiniteId: 0,
    searchQuery: null,
    viewType: 'cards',
    rentedItem: null,
    expandFilters: false,
  }),
  computed: {
    ...mapGetters({
      items: 'item-list/get',
      sort: "item-list/sort",
      search: "item-list/search"
    })
  },
  methods: {
    ...mapActions({
      fetchAll: 'item-list/fetch',
      fetchCategories: 'categories/fetch',
      fetchTags: 'tags/fetch',
      updateFilters: 'item-list/updateFilters',
      setFilterValues: 'item-list/setFilterValues',
      setFilters: 'item-list/setFilters',
      onSortUpdate: 'item-list/onSortUpdate',
      setSearch: 'item-list/setSearch',
    }),
    async onInfiniteLoad($state) {
      this.fetchAll()
        .then(response => response.length ? $state.loaded() : $state.complete())
        .catch(reason => console.error(reason))
    },
    onRentItem(item) {
      this.$refs.dialog.open(item);
    },
    resetInfLoader() {
      this.infiniteId++;
    }
  },
  async created() {
    await this.fetchTags().then(res => this.setFilterValues({key: 'tags', values: res}))
    await this.fetchCategories().then(res => this.setFilterValues({key: 'category', values: res}))
    await this.setFilterValues({key: 'statuses', values: this.statuses})
    await this.setFilters(this.$route.query)

    if (window.innerWidth > 767) {
      this.expandFilters = true;
    }
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

a {
  color: #212529;
}

a:hover {
  text-decoration: none !important;
}

</style>
