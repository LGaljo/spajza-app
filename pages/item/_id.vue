<template>
  <b-container>
    <b-row>
      <b-col offset-md="2" md="8" cols="12" class=" my-3">
        <ItemCard
          v-if="item"
          :object="item"
          @delete="deleteItem"
        />

        <b-card no-body class="mt-3 mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button block v-b-toggle.accordion-2 variant="outline">Spremembe</b-button>
          </b-card-header>
          <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <b-card-text>{{ changes }}</b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import status from "@/mixins/status";
import {DateTime} from "luxon";
import {mapGetters} from "vuex";
import ItemCard from "@/components/ItemCard";

export default {
  name: "Item",
  mixins: [status],
  components: {
    ItemCard
  },
  data() {
    return {
      item: null,
      changes: [],
    }
  },
  computed: {
    ...mapGetters({
      isAdmin: 'user/isAdmin',
      isKeeper: 'user/isKeeper',
      isNormalUser: 'user/isNormalUser',
    }),
  },
  async created() {
    await this.$axios.$get(`/inventory/${this.$route.params.id}`)
      .then(res => {
        this.item = res;
      })
      .catch(res => {
        console.error(res)
        this.$toast.error('Napaka pri pridobivanju podatkov', { duration: 3000 });
      })
    await this.$axios.$get(`/tracing/${this.$route.params.id}`)
      .then(res => {
        this.changes = res;
      })
      .catch(res => {
        console.error(res)
        this.$toast.error('Napaka pri pridobivanju podatkov', { duration: 3000 });
      })
  },
  methods: {
    formatTime(time) {
      return DateTime.fromISO(time).toFormat('dd. MM. yyyy hh:mm')
    },
    deleteItem() {
      this.$axios.$delete(`/inventory/${this.item._id}`)
      .then(res => {
        this.$toast.success(`Predmet "${this.item.name}" uspešno izbrisan`, { duration: 3000 });
        this.$router.replace('/');
      })
      .catch(reason => {
        this.$toast.error(`Napaka pri brisanju predmeta`, { duration: 3000 });
      })
    }
  }
}
</script>

<style scoped>

</style>
