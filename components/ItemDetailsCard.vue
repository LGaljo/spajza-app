<template>
  <div class="card">
    <div v-if="isAdmin || isKeeper" class="card-header">
      <nuxt-link :to="`/edit/${this.$route.params.id}`" class="btn btn-primary">Uredi</nuxt-link>
      <a @click.prevent.st.stop="deleteItem" class="btn btn-danger">Izbriši</a>
    </div>
    <div class="card-body">
      <b-badge v-if="object.category" variant="primary" class="">{{ object.category.name }}</b-badge>

      <h4 class="card-title">{{ object.name }}</h4>

      <b-card-img-lazy :src="itemCover" alt="Image" class="rounded-0"/>

      <b-badge v-if="object.status" :variant="getVariantForStatus(object.status)" class="mr-1">{{ getNameForStatus(object.status) }}</b-badge>

      <div v-if="object.description" class="mb-4">
        <span>{{ object.description }}</span>
      </div>
      <div v-if="object.tags.length" class="my-2">
        <b>Značke:</b>
        <b-badge v-for="tag of object.tags" variant="secondary" :key="tag._id" class="m-1">{{ tag.name }}</b-badge>
      </div>
      <div v-if="object.boughtTime" class="my-2">
        <b>Čas pridobitve:</b>
        <span>{{ formatDateTime(object.boughtTime) }}</span>
      </div>
      <div v-if="object.count" class="my-2">
        <b>Količina:</b>
        <span>{{ object.count }}</span>
      </div>
      <div v-if="object.location" class="my-2">
        <b>Lokacija:</b>
        <span>{{ object.location }}</span>
      </div>
      <div v-if="object.owner" class="my-2">
        <b>Lastnik:</b>
        <span>{{ object.owner }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import status from "@/mixins/status";
import {DateTime} from "luxon";
import {mapGetters} from "vuex";
import datetime from "@/mixins/datetime";

export default {
  name: "ItemCard",
  mixins: [status, datetime],
  props: {
    object: {
      type: Object,
      required: true,
      default: () => {},
    }
  },
  computed: {
    ...mapGetters({
      isAdmin: 'user/isAdmin',
      isKeeper: 'user/isKeeper',
      isNormalUser: 'user/isNormalUser',
    }),
    itemCover() {
      return this.object.cover ? this.object.cover.Location : 'https://spajza-bucket.s3.eu-central-1.amazonaws.com/item/nopicture.png'
    }
  },
  methods: {
    deleteItem() {
      this.$emit('delete')
    }
  }
}
</script>

<style scoped>

</style>
