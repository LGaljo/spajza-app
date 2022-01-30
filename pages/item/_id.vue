<template>
  <b-container>
    <b-row>
      <b-col offset-md="2" md="8" cols="12" class=" my-3">
        <ItemDetailsCard
          v-if="item"
          :object="item"
          @delete="deleteItem"
        />

        <b-card no-body class="mt-3 mb-1">
          <b-card-header header-tag="header" class="p-0" role="tab">
            <b-button block v-b-toggle.accordion-2 variant="outline" class="py-3">Spremembe</b-button>
          </b-card-header>
          <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <b-card-text>
                <div
                  v-if="changes"
                  v-for="(change, key) of changes"
                  :key="change.id"
                  :class="['d-flex', 'flex-column', 'py-3', { 'border-bottom': key !== changes.length - 1}]"
                >
                  <div class="d-flex justify-content-between mb-2">
                    <b-badge variant="dark" class="p-2">{{ formatDateTime(change._createdAt) }}</b-badge>
<!--                    <span v-if="change._createdAt">Čas spremembe: <b>{{ formatDateTime(change._createdAt) }}</b></span>-->
                    <span v-if="change.user">Avtor: <b>{{ change.user.username }}</b></span>
                  </div>
                  <div
                    v-if="change.changes"
                    v-for="(field, key) of change.changes"
                    class="my-1"
                  >
                    <div v-if="field.type === 'changed'">Spremenjeno polje: <b>{{ getFieldName(field.key) }}</b></div>
                    <div v-else-if="field.type === 'added'">Dodano polje: <b>{{ getFieldName(field.key) }}</b></div>
                    <div v-else-if="field.type === 'removed'">Odstranjeno polje: <b>{{ getFieldName(field.key) }}</b></div>
                    <div v-if="field.valueBefore">Pretekla vrednost: <b>{{ field.valueBefore }}</b></div>
                    <div v-if="field.valueNow">Nova vrednost: <b>{{ field.valueNow }}</b></div>
                  </div>
                </div>
                <div v-if="!changes" class="text-center">
                  <b>Ni sprememb</b>
                </div>
              </b-card-text>
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
import ItemDetailsCard from "@/components/ItemDetailsCard";
import datetime from "@/mixins/datetime";
import items from "@/mixins/items";

export default {
  name: "Item",
  mixins: [status, datetime, items],
  components: {
    ItemDetailsCard
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
