<template>
  <b-container>
    <b-row>
      <b-col offset-md="3" md="6" cols="12" class="my-3">
        <h1>Kategorije</h1>

        <!-- ADD NEW -->
        <div class="mt-3">
          <span class="d-block">
            <b>{{ id ? 'Uredi' : 'Dodaj' }}</b>
            <span v-if="id" class="text-muted"> (Počisti polje za dodajanje nove kategorije)</span>
          </span>
          <b-input-group class="my-3">
            <input type="text" class="form-control" placeholder="Dodaj kategorijo" v-model="category"
                   aria-describedby="basic-addon2" @keydown.enter.prevent="addUpdate">
            <div class="input-group-append cursor-pointer" @click="addUpdate">
            <span class="input-group-text fake-button" id="basic-addon2">
              <span
                class="material-icons icon-button"
              >
                {{ id ? 'system_update_alt' : 'add' }}
              </span>
            </span>
            </div>
          </b-input-group>
        </div>

        <!-- TABLE -->
        <table class="mt-3 table table-hover">
          <thead>
          <tr>
            <th scope="col">Ime</th>
            <th scope="col" class="text-right">Dejanja</th>
          </tr>
          </thead>

          <tr v-for="object of categories">
            <td>{{object.name}}</td>
            <td class="text-right">
              <b @click="remove(object)" class="text-danger cursor-pointer mr-2">Izbriši</b>
              <b @click="update(object)" class="text-info cursor-pointer">Uredi</b>
            </td>
          </tr>
        </table>
        <div v-if="!categories.length" class="text-center my-4">Ni kategorij</div>
        <div class="text-muted">Brisana kategorija ne sme vsebovati predmetov.</div>

      </b-col>
    </b-row>
  </b-container>

</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "categories",
  data() {
    return {
      category: null,
      id: null,
    }
  },
  computed: {
    ...mapGetters({
      categories: 'categories/get'
    })
  },
  watch: {
    new() {
      if (this.category?.length === 0) {
        this.id = null;
      }
    }
  },
  async created() {
    await this.$store.dispatch('categories/fetch');
  },
  methods: {
    async remove(category) {
      await this.$store.dispatch('categories/remove', category._id);
      await this.$store.dispatch('categories/fetch');
    },
    update(category) {
      this.category = category?.name;
      this.id = category?._id;
    },
    async addUpdate() {
      if (!this.category) {
        this.$toast.error('Polje ne sme biti prazno', {duration: 3000});
      }

      if (this.id) {
        this.$axios.$post(`/categories/${this.id}`, {name: this.category})
          .then(async res => {
            this.$toast.success(`Obdobje "${this.category}" uspešno posodobljeno`, {duration: 3000});
            this.category = null;
            await this.$store.dispatch('categories/fetch');
          })
          .catch(res => {
            console.error(res)
            this.$toast.error('Napaka pri posodabljanju obdobja', {duration: 3000});
          })
      } else {
        this.$axios.$post(`/categories`, {name: this.category})
          .then(async res => {
            this.$toast.success(`Obdobje "${this.category}" uspešno dodano`, {duration: 3000});
            this.category = null;
            await this.$store.dispatch('categories/fetch');
          })
          .catch(res => {
            console.error(res)
            this.$toast.error('Napaka pri dodajanje obdobja', {duration: 3000});
          })
      }
    }
  }
}
</script>

<style scoped>

</style>
