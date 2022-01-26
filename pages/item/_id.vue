<template>
  <b-container>
    <b-row>
      <b-col offset-md="3" md="6" cols="12" class=" my-3">
        <div class="card">
          <div class="card-header">
            <nuxt-link :to="`/edit/${this.$route.params.id}`" class="btn btn-primary">Uredi</nuxt-link>
            <a @click.prevent.st.stop="deleteItem" class="btn btn-danger">Izbriši</a>
          </div>
          <div v-if="item" class="card-body">
            <b-badge v-if="item.category" variant="primary" class="m-1">{{ item.category.name }}</b-badge>
            <b-badge v-if="item.status" :variant="getVariantForStatus(item.status)" class="m-1">{{ getNameForStatus(item.status) }}</b-badge>
            <h4 class="card-title">{{ item.name }}</h4>
            <div v-if="item.description" class="mb-4">
              <span>{{ item.description }}</span>
            </div>
            <div v-if="item.tags" class="my-2">
              <b>Značke:</b>
              <b-badge v-for="tag of item.tags" variant="secondary" :key="tag._id" class="m-1">{{ tag.name }}</b-badge>
            </div>
            <div v-if="item.boughtTime" class="my-2">
              <b>Čas pridobitve:</b>
              <span>{{ formatTime(item.boughtTime) }}</span>
            </div>
            <div v-if="item.count" class="my-2">
              <b>Količina:</b>
              <span>{{ item.count }}</span>
            </div>
            <div v-if="item.location" class="my-2">
              <b>Lokacija:</b>
              <span>{{ item.location }}</span>
            </div>
            <div v-if="item.owner" class="my-2">
              <b>Lastnik:</b>
              <span>{{ item.owner }}</span>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>

</template>

<script>
import status from "@/mixins/status";
import {DateTime} from "luxon";

export default {
  name: "Item",
  mixins: [status],
  data() {
    return {
      item: null
    }
  },
  async created() {
    await this.$axios.$get(`/inventory/${this.$route.params.id}`)
      .then(res => {
        this.item = res;
      })
      .catch(res => {
        console.error(res)
        this.$toast.error('Napaka pri pridobivanju podatkov', { duration: 10000 });
      })

  },
  computed: {
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
