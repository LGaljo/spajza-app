<template>
  <b-container>
    <b-row>
      <b-col offset-md="3" md="6" cols="12" class="my-3">
        <h1>Značke</h1>

        <!-- ADD NEW -->
        <div class="mt-3">
          <span class="d-block">
            <b>{{ id ? 'Uredi' : 'Dodaj' }}</b>
            <span v-if="id" class="text-muted"> (Počisti polje za dodajanje nove značke)</span>
          </span>
          <b-input-group class="my-3">
            <input type="text" class="form-control" placeholder="Dodaj značko" v-model="tag"
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

          <tr v-for="object of tags">
            <td>{{ object.name }}</td>
            <td class="text-right">
              <b @click="removeTag(object)" class="text-danger cursor-pointer mr-2">Izbriši</b>
              <b @click="update(object)" class="text-info cursor-pointer">Uredi</b>
            </td>
          </tr>
        </table>
        <div v-if="!tags.length" class="text-center my-4">Ni značk</div>
        <div class="text-muted">Brisana značka ne sme vsebovati predmetov.</div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

import {mapActions, mapGetters} from "vuex";

export default {
  name: "tags",
  data() {
    return {
      tag: null,
      id: null,
    }
  },
  computed: {
    ...mapGetters({
      tags: 'tags/get'
    })
  },
  watch: {
    new() {
      if (this.tag?.length === 0) {
        this.id = null;
      }
    }
  },
  async created() {
    await this.fetch();
  },
  methods: {
    ...mapActions({
      remove: 'tags/remove',
      fetch: 'tags/fetch',
    }),
    async removeTag(tag) {
      await this.remove(tag?._id);
      await this.fetch();
    },
    update(category) {
      this.tag = category?.name;
      this.id = category?._id;
    },
    async addUpdate() {
      if (!this.tag) {
        this.$toast.error('Polje ne sme biti prazno', {duration: 3000});
        return;
      }

      if (this.id) {
        this.$axios.$post(`/tags/${this.id}`, {name: this.tag})
          .then(async res => {
            this.$toast.success(`Značka "${this.tag}" uspešno posodobljena`, {duration: 3000});
            this.tag = null;
            await this.$store.dispatch('tags/fetch');
          })
          .catch(res => {
            console.error(res)
            this.$toast.error('Napaka pri posodabljanju značke', {duration: 3000});
          })
      } else {
        this.$axios.$post(`/tags`, {name: this.tag})
          .then(async res => {
            this.$toast.success(`Značka "${this.tag}" uspešno dodana`, {duration: 3000});
            this.tag = null;
            await this.$store.dispatch('tags/fetch');
          })
          .catch(res => {
            console.error(res)
            this.$toast.error('Napaka pri dodajanje značke', {duration: 3000});
          })
      }
    }
  }
}
</script>

<style scoped>

</style>
