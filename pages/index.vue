<template>
  <b-container>
    <b-row class="my-2">
      <div class="offset-md-3 col-md-6 text-center">
        <div class="input-group my-3">
          <input type="text" class="form-control" placeholder="Išči" v-model="params.search"
                 aria-describedby="basic-addon2" @input="search" @keydown.enter.prevent="search">
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
            :identifier="infiniteId"
            ref="infiniteLoading"
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
import status from "../mixins/status";
import {mapGetters} from "vuex";
import InfiniteLoading from 'vue-infinite-loading';
import ItemCard from "../components/ItemCard";
import sidebar from "../components/sidebar";
import RentDialog from "../components/RentDialog";
import filters from "../mixins/filters";

export default {
  components: { InfiniteLoading, ItemCard, sidebar, RentDialog },
  mixins: [status, filters],
  data() {
    return {
      viewType: 'cards',
      rentedItem: null,
      infiniteId: 1,
    }
  },
  watch: {
    items: {
      deep: true,
      async handler() {
        // await this.$router.replace({ name: '', query: { abc: 1 }})
      }
    },
    selected: {
      deep: true,
      async handler() {
        await this.$router.replace({ name: '', query: this.selected})
      }
    },
  },
  computed: {
    ...mapGetters({
      items: 'items/get',
    })
  },
  methods: {
    async onInfiniteLoad($state) {
      await this.fetch()
        .then(response => {
          if (response > 0) {
            $state.loaded();
          } else {
            $state.complete();
          }
        })
    },
    async search(event) {
      // await this.$store.commit('filters/set_search', this.searchQuery)
      await this.clear_items();
      await this.fetch();
      await this.$refs.infiniteLoading.reset();
      this.infiniteId++;
      // await this.$store.commit('filters/clear_items')
      // await this.$store.dispatch('filters/fetch')
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
    // await this.$store.dispatch('filters/init_filters');
    await this.init();
  },
  async mounted() {
    for (const key in this.$route.query) {
      // this.$store.commit('filters/set_visibility', key)
      this.filters[key].visible = !this.filters[key].visible
      this.selected[key] = this.$route.query[key]

      // this.$store.commit('filters/set', { key, value: this.$route.query[key] })
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
