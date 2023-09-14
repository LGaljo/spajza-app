<template>
  <b-container>
    <b-row>
      <b-col cols="12" class="text-center my-3">
        <h1>Predloge slik</h1>
      </b-col>
      <b-col cols="12" class="">
        <div>Predloge so namenjene za uporabo označevanja defektov na predmetih. Vsaka kategorija ima lahko eno sliko.
        </div>
      </b-col>
      <b-col md="3" class="my-3">
        <b-button @click="openAddTemplate">Dodaj predlogo</b-button>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" class="mt-2">
        <h3>Dodane predloge po kategorijah</h3>
      </b-col>
      <template v-if="filterCategories.length > 0">
        <b-col
          v-for="category of filterCategories"
          :key="category._id"
          cols="3"
          class="mb-3"
        >
          <b-card
            :title="category.name"
            :img-src="category.url"
          >
            <b-button @click="remove(category)" variant="primary">Odstrani predlogo</b-button>
          </b-card>
        </b-col>
      </template>
      <b-col v-else cols="12">
        <div>Ni dodanih predlog</div>
      </b-col>
    </b-row>

    <ModalDialog
      ref="addTemplate"
      title="Dodaj predlogo"
      action="Dodaj"
      @first="addTemplate"
      :disable-action="!selectedCategory || !templateImage"
    >
      <template #body>
        <div class="">
          <span class="d-block">
            <b>Izberi kategorijo in dodaj sliko</b>
          </span>
          <b-input-group class="my-3">
            <b-form-select
              v-model="selectedCategory"
              :options="categories"
              :value-field="'_id'"
              :text-field="'name'"
            />
          </b-input-group>
          <b-input-group class="my-3">
            <b-form-file
              v-model="templateImage"
              id="image"
              accept="image/*"
              :state="Boolean(templateImage)"
              placeholder="Izberi ali spusti datoteko..."
              drop-placeholder="Spusti datoteko..."
            />
          </b-input-group>
        </div>
      </template>
    </ModalDialog>
  </b-container>

</template>

<script>
import {mapGetters} from "vuex";
import ModalDialog from "~/components/modals/ModalDialog.vue";

export default {
  name: "ImageTemplates",
  components: {ModalDialog},
  data() {
    return {
      selectedCategory: null,
      id: null,
      templateImage: null,
    }
  },
  computed: {
    ...mapGetters({
      categories: 'categories/get'
    }),
    filterCategories() {
      return this.categories.filter((c) => !!c.url)
    }
  },
  watch: {
    new() {
      if (this.selectedCategory?.length === 0) {
        this.id = null;
      }
    }
  },
  async created() {
    await this.$store.dispatch('categories/fetch');
  },
  methods: {
    async remove(category) {
      // TODO: remove image
      // await this.$store.dispatch('categories/update', category._id);
      // await this.$store.dispatch('categories/fetch');
    },
    update(category) {
      this.selectedCategory = category?.name;
      this.id = category?._id;
    },
    openAddTemplate() {
      this.$refs.addTemplate.open()
    },
    addTemplate() {
      this.$refs.addTemplate.close()
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
