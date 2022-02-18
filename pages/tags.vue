<template>
  <b-container>
    <b-row>
      <b-col offset-md="3" md="6" cols="12" class=" my-3">
        <h1>Značke</h1>

        <!-- ADD NEW -->
        <div class="mt-3">
          <span class="d-block"><b>Dodaj</b></span>
          <b-input-group class="my-3">
            <input type="text" class="form-control" placeholder="Dodaj značko" v-model="tagNew"
                   aria-describedby="basic-addon2" @click="addTag">
            <div class="input-group-append cursor-pointer" @click="addTag">
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

          <tr v-for="tag of tags">
            <td>{{tag.name}}</td>
            <td class="text-right">
              <b @click="removeCat(tag)" class="text-danger cursor-pointer">Izbriši</b>
            </td>
          </tr>
        </table>
        <div class="text-muted">Brisana značka ne sme vsebovati predmetov.</div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

export default {
  name: "tags",
  data() {
    return {
      tags: [],
      tagNew: null
    }
  },
  async created() {
    await this.getTags()
  },
  methods: {
    async getTags() {
      this.$axios.$get(`/tags`)
        .then(res => {
          this.tags = res;
        })
        .catch(res => {
          console.error(res)
          this.$toast.error('Napaka pri pridobivanju značk', {duration: 10000});
        })
    },
    async removeCat(tag) {
      this.$axios.$delete(`/tags/${tag._id}`)
        .then(async res => {
          this.$toast.success(`Značka "${tag.name}" uspešno izbrisana`, {duration: 3000});
          await this.getTags();
        })
        .catch((res) => {
          console.error(res)
          this.$toast.error('Napaka pri odstranjevanju značke', {duration: 3000});
        })
    },
    async addTag() {
      if (!this.tagNew) {
        this.$toast.error('Polje ne sme biti prazno', {duration: 3000});
      }

      this.$axios.$post(`/tags`, {name: this.tagNew})
        .then(async res => {
          this.$toast.success(`Značka "${this.tagNew}" uspešno dodana`, {duration: 3000});
          this.tagNew = null;
          await this.getTags();
        })
        .catch(res => {
          console.error(res)
          this.$toast.error('Napaka pri dodajanje značke', {duration: 3000});
        })
    }
  }
}
</script>

<style scoped>

</style>
