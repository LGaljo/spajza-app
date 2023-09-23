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
        <h3>Predloge po kategorijah</h3>
      </b-col>
      <b-col v-if="filterCategories.length > 0">
        <b-card-group deck
        >
          <b-card
            v-for="category of filterCategories"
            :key="category._id"
            :img-src="category.templateImage.Location"
            class="mb-3"
          >
            <b-card-title class="h-100">
              <div class="d-flex h-100">
                <div class="align-self-end">
                  {{ category.name }}
                </div>
              </div>
            </b-card-title>
            <template #footer>
              <b-button @click="remove(category)" variant="primary">Odstrani predlogo</b-button>
            </template>
          </b-card>
        </b-card-group>
      </b-col>
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
import {mapActions, mapGetters} from "vuex";
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
      categories: 'categories/getList'
    }),
    filterCategories() {
      return this.categories.filter((c) => !!c.templateImage)
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
    await this.fetch();
  },
  methods: {
    ...mapActions({
      fetch: 'categories/fetch',
    }),
    async remove(category) {
      await this.$axios.$post(`/categories/remove_file/${category._id}`)
        .then(() => {
          this.$toast.success(`Predloga uspešno izbrisana`, {duration: 3000});
        })
        .catch((err) => {
          console.error(err)
          this.$toast.error('Napaka pri dodajanju predloge', {duration: 3000});
        })
        .finally(async () => (await this.fetch()))
    },
    openAddTemplate() {
      this.selectedCategory = null;
      this.templateImage = null;
      this.$refs.addTemplate.open()
    },
    async addTemplate() {
      if (!this.selectedCategory) {
        this.$toast.error('Polje ne sme biti prazno', {duration: 3000});
        return
      }
      if (!this.templateImage) {
        this.$toast.error('Izberi sliko', {duration: 3000});
        return
      }

      const formData = new FormData();
      formData.append('file', this.templateImage);

      await this.$axios.$post(`/categories/file/${this.selectedCategory}`, formData)
        .then(() => {
          this.$toast.success(`Predloga uspešno dodana`, {duration: 3000});
        })
        .catch((err) => {
          console.error(err)
          this.$toast.error('Napaka pri dodajanju predloge', {duration: 3000});
        })
        .finally(() => {
          this.fetch()
          this.category = null
          this.$refs.addTemplate.close()
        })
    }
  }
}
</script>

<style scoped>

</style>
