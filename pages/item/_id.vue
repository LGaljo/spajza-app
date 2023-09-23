<template>
  <b-container>
    <b-row>
      <b-col offset-md="2" md="8" cols="12" class=" my-3">
        <ItemDetailsCard
          v-if="item"
          v-model="item"
          @delete="$refs.deleteDialog.open()"
          @onRentItem="$refs.dialog.open(item)"
        />

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
import ItemDetailsCard from "../../components/ItemDetailsCard";

export default {
  name: "Item",
  mixins: [status, datetime],
  components: {
    RentDialog,
    ModalDialog,
    ItemDetailsCard,
  },
  computed: {
    ...mapGetters({
      user: 'user/getUser',
      item: 'item/get',
      changes: 'tracing/get',
      isAdmin: 'user/isAdmin',
      isKeeper: 'user/isKeeper',
      isNormalUser: 'user/isNormalUser',
    }),
  },
  async created() {
    await this.fetchItem(this.$route.params.id)
    await Promise.all([
      await this.fetchCategory(this.item?.category?._id),
      await this.fetchTracing(this.$route.params.id)
    ])
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
