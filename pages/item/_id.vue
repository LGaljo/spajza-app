<template>
  <b-container>
    <b-row>
      <b-col offset-md="2" md="8" cols="12" class=" my-3">
        <ItemDetailsCard
          v-if="item"
          :object="item"
          @delete="deleteItemRequest"
          @onRentItem="onRentItem"
        />

        <b-card title="Izposoja" v-if="item && item.rents && item.renter" class="mt-3 mb-1">
          <b-card-text>
            <div v-if="!item.rents.subject">Predmet si je izposodil <b>{{ item.renter.username }}</b> dne <b>{{formatDate(item.rents.borrowedAt)}}.</b></div>
            <div v-else>Predmet je <b>{{ item.renter.username }}</b> posodil <b>{{ item.rents.subject }}</b> dne <b>{{formatDate(item.rents.borrowedAt)}}</b>.</div>
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

        <b-card v-if="item" no-body class="mt-3 mb-1">
          <b-card-header header-tag="header" class="p-0" role="tab">
            <b-button block v-b-toggle.accordion-2 variant="outline" class="py-3">Spremembe</b-button>
          </b-card-header>
          <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <b-card-text>
                <div
                  v-if="changes.length !== 0"
                  v-for="(change, key) of changes"
                  :key="change.id"
                  :class="['d-flex', 'flex-column', 'py-3', { 'border-bottom': key !== changes.length - 1}]"
                >
                  <div class="d-flex justify-content-between mb-2">
                    <b-badge variant="dark" class="p-2">{{ formatDateTime(change._createdAt) }}</b-badge>
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
                <div v-if="changes.length === 0" class="text-center">
                  <b>Ni sprememb</b>
                </div>
              </b-card-text>
            </b-card-body>
          </b-collapse>
        </b-card>

        <RentDialog
          ref="dialog"
          @onRented="onItemRented"
        />

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
      user: 'user/getUser',
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
    deleteItemRequest() {
      this.$refs.deleteDialog.open();
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
    },
    returnItem() {
      this.$axios.$post(`/rents/return/${this.item._id}`)
        .then(res => {
          this.item = res;
          this.$toast.success(`Predmet "${this.item.name}" uspešno vrnjen`, { duration: 3000 });
        })
        .catch(reason => {
          this.$toast.error(`Napaka pri brisanju predmeta`, { duration: 3000 });
        })
    },
    onRentItem() {
      this.$refs.dialog.open(this.item);
    },
    onItemRented(item) {
      this.item = item
      this.$toast.success(`${item.name} uspešno izposojen`, { duration: 3000 });
    }
  }
}
</script>

<style scoped>

</style>
