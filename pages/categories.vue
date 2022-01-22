<template>
  <b-row class="w-100">
    <b-col offset-md="3" md="6">
      <h1>Kategorije</h1>

      <!-- ADD NEW -->
      <div class="mt-3">
        <span class="d-block"><b>Dodaj</b></span>
        <b-input-group class="my-3">
          <input type="text" class="form-control" placeholder="Dodaj kategorijo" v-model="categoryNew"
                 aria-describedby="basic-addon2">
          <div class="input-group-append cursor-pointer" @click="addCategory">
            <span class="input-group-text fake-button" id="basic-addon2">
              <span
                class="material-icons icon-button"
              >
                add
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

        <tr v-for="category of categories">
          <td>{{category.name}}</td>
          <td class="text-right">
            <b @click="removeCat(category)" class="text-danger cursor-pointer">Izbriši</b>
          </td>
        </tr>
      </table>
      <div class="text-muted">Brisana kategorija ne sme vsebovati predmetov.</div>


    </b-col>
  </b-row>
</template>

<script>

export default {
  name: "categories",
  data() {
    return {
      categories: [],
      categoryNew: null
    }
  },
  async created() {
    await this.getCategories()
  },
  methods: {
    async getCategories() {
      this.$axios.$get(`/categories`)
        .then(res => {
          this.categories = res;
        })
        .catch(res => {
          console.error(res)
          this.$toast.error('Napaka pri pridobivanju kategorij', {duration: 10000});
        })
    },
    async removeCat(category) {
      this.$axios.$delete(`/categories/${category._id}`)
        .then(async res => {
          this.$toast.success(`Kategorija "${category.name}" uspešno izbrisana`, {duration: 3000});
          await this.getCategories();
        })
        .catch((res) => {
          console.error(res)
          this.$toast.error('Napaka pri odstranjevanju kategorije', {duration: 3000});
        })
    },
    async addCategory() {
      if (!this.categoryNew) {
        this.$toast.error('Polje ne sme biti prazno', {duration: 3000});
      }

      this.$axios.$post(`/categories`, {name: this.categoryNew})
        .then(async res => {
          this.$toast.success(`Kategorija "${this.categoryNew}" uspešno dodana`, {duration: 3000});
          this.categoryNew = null;
          await this.getCategories();
        })
        .catch(res => {
          console.error(res)
          this.$toast.error('Napaka pri dodajanje kategorije', {duration: 3000});
        })
    }
  }
}
</script>

<style scoped>

</style>
