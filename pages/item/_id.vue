<template>
  <b-container>
    <b-row>
      <b-col offset-md="2" md="8" cols="12" class=" my-3">
        <b-card>
          <template #header v-if="item">
            <div class="d-flex w-100 flex-wrap justify-content-start">
              <b-button
                variant="primary"
                v-if="!item.rents"
                @click.prevent.stop="$refs.dialog.open(item)"
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
                <b-dropdown-item href="#" @click.prevent.stop="$refs.deleteDialog.open()">Izbriši</b-dropdown-item>
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
              <b-card-img-lazy :src="coverSrc" alt="cover image"></b-card-img-lazy>
              <div v-if="item.cover.length > 1">
                <template v-for="im in item.cover">
                  <b-img
                    v-if="im"
                    :src="im.Location"
                    :key="im.key"
                    alt="Image"
                    class="rounded-0 mt-1 fake-button w-25"
                    @click="coverSrc = im.Location"
                  />
                </template>
              </div>
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


        <b-card title="Izposoja" v-if="item && item.rents && item.rents.renter" class="mt-3 mb-1">
          <b-card-text>
            <div v-if="!item.rents.subject">Predmet si je izposodil <b>{{ item.rents.renter.username }}</b> dne
              <b>{{ formatDate(item.rents.borrowedAt) }}.</b></div>
            <div v-else>Predmet je <b>{{ item.rents.renter.username }}</b> posodil <b>{{ item.rents.subject }}</b> dne
              <b>{{ formatDate(item.rents.borrowedAt) }}</b>.
            </div>
            <div>Obljubil je, da ga vrne <b>{{ formatDate(item.rents.returnTime) }}</b>.</div>
          </b-card-text>
          <b-button
            v-if="user && (user._id === item.rents.renter || isAdmin || isKeeper)"
            href="#"
            @click.prevent.stop="returnItem"
            variant="primary"
          >
            Vrni
          </b-button>
        </b-card>

        <ChangesList v-if="item && changes" :changes="changes" />

        <RentDialog ref="dialog" />

        <ModalDialog
          v-if="item"
          ref="deleteDialog"
          :title="`Izbriši`"
          action="Izbriši"
          @first="deleteItem"
        >
          <div slot="body">Želiš zbrisati <b>{{ item.name }}</b>?</div>
        </ModalDialog>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import status from "../../mixins/status";
import datetime from "../../mixins/datetime";
import RentDialog from "../../components/modals/RentDialog";
import ModalDialog from "../../components/modals/ModalDialog";

export default {
  name: "Item",
  mixins: [status, datetime],
  components: {
    RentDialog,
    ModalDialog,
  },
  computed: {
    ...mapGetters({
      user: 'user/getUser',
      item: 'item/get',
      changes: 'tracing/get',
      isAdmin: 'user/isAdmin',
      isKeeper: 'user/isKeeper',
      isNormalUser: 'user/isNormalUser',
      category: 'categories/getOne',
    }),
    noImage() {
      return process.env.NO_IMAGE;
    },
    hasTemplateImage() {
      return !!this.category?.templateImage
    }
  },
  data() {
    return {
      coverSrc: null,
      counter: 0,
    }
  },
  async mounted() {
    await this.fetchItem(this.$route.params.id)
      .then(() => {
        if (this.item?.cover?.length) {
          this.coverSrc = this.item.cover[0].Location
        }
      })
    await this.fetchCategory(this.item?.category?._id)
    await this.fetchTracing(this.$route.params.id)
  },
  methods: {
    ...mapActions({
      fetchItem: 'item/fetch',
      removeItem: 'item/remove',
      returnItem: 'item/returnItem',
      fetchTracing: 'tracing/fetch',
      fetchCategory: 'categories/fetchOne',
    }),
    async deleteItem() {
      await this.removeItem(this.item._id)
      .then(() => {
        this.$router.replace('/');
      })
    },
  }
}
</script>

<style scoped>

</style>
