<template>
  <div class="modal-fullscr">
    <b-card>
      <template #header v-if="item">
        <div class="d-flex w-100 flex-wrap justify-content-start">
          <b-button
            variant="primary"
            v-if="!item.rents"
            @click.prevent.stop="rentItem"
          >
            Izposodi
          </b-button>

          <div class="mx-2">
            <b-button
              variant="warning"
              v-if="hasTemplateImage"
              :disabled="!(isAdmin || isKeeper)"
              @click.prevent.stop="$router.push(`/edit/defects/${item._id}`)"
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
      <b-card-body class="p-0" v-if="item">
        <b-badge v-if="item && item.category" variant="primary" class="p-2 mb-2">{{ item.category.name }}</b-badge>
        <b-card-title>
          {{ item.name }}
        </b-card-title>

        <b-badge v-if="item.status" :variant="getVariantForStatus(item.status)" class="my-1">{{ getNameForStatus(item.status) }}</b-badge>
        <b-badge v-if="item.extras && item.extras.defects" :variant="'danger'" class="my-1">Šotor z defekti</b-badge>

        <div v-if="item.cover && item.cover.length">
          <b-card-img-lazy v-for="im in item.cover" :src="im.Location" :key="im.key" alt="Image" class="rounded-0 mt-1"/>
        </div>
        <div v-else>
          <b-card-img-lazy :src="noImage" alt="Image" class="rounded-0 mt-1"/>
        </div>

        <div v-if="item.description" class="mb-4">
          <span>{{ item.description }}</span>
        </div>
        <div v-if="item.tags.length" class="my-2">
          <b>Značke:</b>
          <b-badge v-for="tag of item.tags" variant="secondary" :key="tag._id" class="m-1">{{ tag.name }}</b-badge>
        </div>
        <div v-if="item.boughtTime" class="my-2">
          <b>Čas pridobitve:</b>
          <span>{{ formatDateTime(item.boughtTime) }}</span>
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
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
import status from "~/mixins/status";
import {mapActions, mapGetters} from "vuex";
import datetime from "~/mixins/datetime";
import ModalDialog from "./modals/ModalDialog";

export default {
  name: "ItemDetailsCard",
  mixins: [status, datetime],
  components: { ModalDialog },
  data() {
    return {
      counter: 0,
    }
  },
  computed: {
    ...mapGetters({
      item: 'item/get',
      category: 'categories/getOne',
      isAdmin: 'user/isAdmin',
      isKeeper: 'user/isKeeper',
      isNormalUser: 'user/isNormalUser',
    }),
    itemCover() {
      return this.item?.cover?.length ?? process.env.NO_IMAGE
    },
    noImage() {
      return process.env.NO_IMAGE;
    },
    hasTemplateImage() {
      return !!this.category?.templateImage
    }
  },
  methods: {
    deleteItem() {
      this.$emit('delete')
    },
    rentItem() {
      this.$emit('onRentItem')
    },
  }
}
</script>

<style scoped>
</style>
