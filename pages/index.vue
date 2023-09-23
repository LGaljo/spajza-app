<template>
  <b-container>
    <b-row class="my-2">
      <b-form class="offset-md-3 col-md-6 text-center">
        <b-input-group class="mt-3">
          <!-- Search box -->
          <b-form-input
            type="text"
            placeholder="Išči"
            v-model="searchQuery"
            aria-describedby="basic-addon2"
            @keydown.enter.prevent="search"
          />
          <div class="input-group-append" @click.prevent="search">
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
            v-model="sort.field"
            :options="sort.options"
            no-caret
            size="sm"
            class="mr-2"
            @change="onFilterChange()"
          />
          <b-button
            v-if="sort.dir === 'asc'"
            size="sm"
            variant="light"
            @click="sort.dir = 'desc'; onFilterChange()"
            style="width: 40px;"
          >
            <b-icon-arrow-up/>
          </b-button>
          <b-button
            v-else
            size="sm"
            variant="light"
            @click="sort.dir = 'asc'; onFilterChange()"
            style="width: 40px;"
          >
            <b-icon-arrow-down/>
          </b-button>
        </div>
      </b-col>
    </b-row>

    <b-row>
      <!-- Sidebar filters -->
      <sidebar
        class="px-md-0 col-md-2 col-12 mb-3"
        :filters="filters"
        @change="onFilterChange"
        v-model="selected"
      />

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
import {mapGetters} from "vuex";
import InfiniteLoading from 'vue-infinite-loading';
import ItemCard from "../components/ItemCard";
import sidebar from "../components/sidebar";
import RentDialog from "../components/modals/RentDialog";

export default {
  components: { InfiniteLoading, ItemCard, sidebar, RentDialog },
  mixins: [status],
  data() {
    return {
      sort: {
        field: 'name',
        dir: 'asc',
        options: [
          { text: 'Ime predmeta', value: 'name' },
          { text: 'Čas zadnje posodobitve', value: '_updatedAt' },
          { text: 'Čas vnosa', value: '_createdAt' },
          { text: 'Identifikator', value: '_id' },
          { text: 'Vsebuje sliko', value: 'cover' },
        ]
      },
      infiniteId: 0,
      searchQuery: null,
      viewType: 'cards',
      selected: {
        category: null,
        tags: [],
        statuses: [],
      },
      filters: {
        category: {
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
      this.filters.category.values = this.categories;
    },
    tags() {
      this.filters.tags.values = this.tags;
    },
  },
  computed: {
    ...mapGetters({
      categories: 'categories/getList',
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
          limit: this.limit,
          skip: this.skip,
          sort: this.sort.field,
          sort_dir: this.sort.dir
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
    async onFilterChange() {
      // console.log('changed')
      this.resetInfLoader();
      const query = {};
      if (this.selected.category) query['category'] = this.selected.category
      if (this.selected.tags.length) query['tags'] = this.selected.tags
      if (this.selected.statuses.length) query['statuses'] = this.selected.statuses
      if (this.sort.field) query['sort'] = this.sort.field
      if (this.sort.field) query['dir'] = this.sort.dir
      let encoded = '?' + this.encodeQueryData(query)
      encoded = encoded.length > 1 ? encoded : '';
      history.pushState(
        {},
        null,
        `${this.$route.path}${encoded}`
      );
    },
    encodeQueryData(data) {
      const ret = [];
      for (let d in data)
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
      return ret.join('&');
    },

    async search() {
      this.resetInfLoader();
    },
    onRentItem(item) {
      this.$refs.dialog.open(item);
    },
    resetInfLoader() {
      this.infiniteId++;
      this.items = [];
      this.skip = 0;
    }
  },
  async created() {
    await Promise.all([
      this.$store.dispatch('categories/fetch'),
      this.$store.dispatch('tags/fetch'),
    ])
    this.filters.statuses.values = this.statuses

    if (this.$route.query.category) {
      this.selected.category = this.$route.query.category
      this.filters.category.visible = true;
    }
    if (this.$route.query.tags) {
      this.selected.tags = this.$route.query.tags.split(',')
      this.filters.tags.visible = true;
    }
    if (this.$route.query.statuses) {
      this.selected.statuses = this.$route.query.statuses.split(',')
      this.filters.statuses.visible = true;
    }
    this.sort.dir = this.$route.query?.dir ?? 'asc';
    this.sort.field = this.$route.query?.name ?? 'name';
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
