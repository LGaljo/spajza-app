<template>
  <b-container>
    <b-row>
      <b-col offset-md="2" md="8" cols="12" class=" my-3">
        <ItemDetailsCard
          v-if="item"
          v-model="item"
          @delete="deleteItemRequest"
          @onRentItem="onRentItem"
          @updateItem="updateItem"
        />

        <b-card title="Izposoja" v-if="item && item.rents && item.rents.renter" class="mt-3 mb-1">
          <b-card-text>
            <div v-if="!item.rents.subject">Predmet si je izposodil <b>{{ item.rents.renter.username }}</b> dne <b>{{formatDate(item.rents.borrowedAt)}}.</b></div>
            <div v-else>Predmet je <b>{{ item.rents.renter.username }}</b> posodil <b>{{ item.rents.subject }}</b> dne <b>{{formatDate(item.rents.borrowedAt)}}</b>.</div>
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

<!--        <Comments v-if="item" :comments="comments" />-->

        <ChangesList v-if="item && changes" :changes="changes" />

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
import {mapGetters} from "vuex";
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
  data() {
    return {
      item: null,
      changes: [],
      comments: [
        {
          parent_comment_id: null,
          message: 'Ta šotor je bil enkrat pobruhan',
          _createdAt: '2022-09-08T15:09:40.021Z',
          user: {
            _id: '12312312312ab23b123675',
            username: 'lukag',
            firstName: 'Luka',
            lastName: 'Galjot',
          },
          replies: [
            {
              parent_comment_id: '82374982374928374',
              message: 'Nik ga je',
              _createdAt: '2022-09-08T15:10:40.021Z',
              user: {
                _id: '12312312312ab23b123675',
                username: 'lukag',
                firstName: 'Luka',
                lastName: 'Galjot',
              },
            }
          ]
        }
      ],
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
    },
    async updateItem() {
      await this.$axios.$put(`/inventory/${this.item._id}`, {
        ...this.item,
      })
        .then(async (res) => {
          this.$toast.success(`Predmet "${this.item.name}" uspešno posodobljen`, {duration: 2000});
        })
        .catch(rej => {
          console.error(rej);
        });
    }
  }
}
</script>

<style scoped>

</style>
