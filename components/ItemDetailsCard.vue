<template>
  <div class="modal-fullscr">
    <b-card>
      <template #header>
        <div class="d-flex w-100 flex-wrap justify-content-start">
          <b-button
            variant="primary"
            v-if="!value.rents"
            @click.prevent.stop="rentItem"
          >
            Izposodi
          </b-button>

          <div class="mx-2">
            <b-button
              variant="warning"
              v-if="isTent"
              :disabled="!(isAdmin || isKeeper)"
              @click.prevent.stop="$router.push(`/edit/defects/${value._id}`)"
            >
              Pomanjkljivosti
            </b-button>
          </div>

          <b-dropdown v-if="isAdmin || isKeeper" text="Dejanja" class="ml-auto" right>
            <b-dropdown-item :to="`/edit/${$route.params.id}`">Uredi</b-dropdown-item>
            <b-dropdown-item href="#" @click.prevent.stop="deleteItem">Izbriši</b-dropdown-item>
          </b-dropdown>
        </div>
      </template>
      <b-card-body class="p-0">
        <b-badge v-if="value.category" variant="primary" class="p-2 mb-2">{{ value.category.name }}</b-badge>
        <b-card-title>
          {{ value.name }}
        </b-card-title>

        <b-badge v-if="value.status" :variant="getVariantForStatus(value.status)" class="my-1">{{ getNameForStatus(value.status) }}</b-badge>
        <b-badge v-if="value.extras && value.extras.faults" :variant="'danger'" class="my-1">Šotor z defekti</b-badge>

        <b-card-img-lazy :src="itemCover" alt="Image" class="rounded-0 mt-1"/>

        <div v-if="value.description" class="mb-4">
          <span>{{ value.description }}</span>
        </div>
        <div v-if="value.tags.length" class="my-2">
          <b>Značke:</b>
          <b-badge v-for="tag of value.tags" variant="secondary" :key="tag._id" class="m-1">{{ tag.name }}</b-badge>
        </div>
        <div v-if="value.boughtTime" class="my-2">
          <b>Čas pridobitve:</b>
          <span>{{ formatDateTime(value.boughtTime) }}</span>
        </div>
        <div v-if="value.count" class="my-2">
          <b>Količina:</b>
          <span>{{ value.count }}</span>
        </div>
        <div v-if="value.location" class="my-2">
          <b>Lokacija:</b>
          <span>{{ value.location }}</span>
        </div>
        <div v-if="value.owner" class="my-2">
          <b>Lastnik:</b>
          <span>{{ value.owner }}</span>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import status from "~/mixins/status";
import {mapGetters} from "vuex";
import datetime from "~/mixins/datetime";
import ModalDialog from "./modals/ModalDialog";

export default {
  name: "ItemCard",
  mixins: [status, datetime],
  components: { ModalDialog },
  props: {
    value: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data() {
    return {
      counter: 0,
    }
  },
  computed: {
    ...mapGetters({
      isAdmin: 'user/isAdmin',
      isKeeper: 'user/isKeeper',
      isNormalUser: 'user/isNormalUser',
    }),
    itemCover() {
      return this.value.cover ? this.value.cover.Location : 'https://spajza-bucket.s3.eu-central-1.amazonaws.com/item/nopicture.png'
    },
    isTent() {
      return this.value?.category?._id === process.env.TENT_ID
    }
  },
  methods: {
    deleteItem() {
      this.$emit('delete')
    },
    rentItem() {
      this.$emit('onRentItem')
    },
    updateItem() {
      this.$emit('updateItem')
    },
  }
}
</script>

<style scoped>
</style>
