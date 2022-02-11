<template>
  <b-container>
    <b-row>
      <b-col offset-md="3" md="6" cols="12" class="my-3">
        <div class="text-center">
          <h1>Dodaj nov predmet</h1>
        </div>
        <b-form class="w-100" @submit.prevent="onSubmit" @reset="onReset">
          <b-form-group
            id="input-group-1"
            label="Ime predmeta"
            label-for="title"
          >
            <b-form-input
              type="text"
              class="form-control"
              id="title"
              placeholder="Vnesi ime"
              v-model="form.name"
            />
          </b-form-group>

          <!-- IMAGE -->
          <b-form-group
            id="input-group-2"
            label="Slika"
            label-for="image"
          >
            <b-form-file
              v-model="cover.file"
              id="image"
              accept="image/*"
              :state="Boolean(cover.file)"
              placeholder="Izberi ali spusti datoteko..."
              drop-placeholder="Spusti datoteko..."
            ></b-form-file>
            <div v-if="cover.path" class="mt-3 d-flex justify-content-between flex-row align-items-center">
              <div v-if="cover.file">Izbrana slika: {{ cover.file ? cover.file.name : '' }}</div>
              <a @click="cover = {file: null, path: null}" href="#">Odstrani sliko</a>
            </div>

            <b-img v-if="cover.path" :src="cover.path" fluid alt="image" class="w-50"></b-img>
          </b-form-group>

          <b-form-group
            id="input-group-2"
            label="Kategorija"
            label-for="category"
          >
            <b-form-radio-group
              v-model="form.category"
              id="category"
              multiple="false"
            >
              <b-form-radio
                v-for="category of categories"
                :key="category.name"
                :value="category._id"
              >
                {{ category.name }}
              </b-form-radio>
            </b-form-radio-group>
          </b-form-group>

          <b-form-group
            id="input-group-3"
            label="Značke"
            label-for="tags"
          >
            <b-form-checkbox-group
              v-model="form.tags"
              id="tags"
            >
              <b-form-checkbox
                v-for="tag of tags"
                :key="tag.name"
                :value="tag._id"
              >
                {{ tag.name }}
              </b-form-checkbox>

            </b-form-checkbox-group>
          </b-form-group>

          <!-- STATUS -->
          <b-form-select v-model="form.status" :options="statuses" aria-placeholder="Stanje" class="mb-2">
            <b-form-select-option :value="null" disabled>-- Izberi stanje predmeta --</b-form-select-option>
          </b-form-select>

          <b-form-group
            id="input-group-4"
            label="Čas pridobitve"
            label-for="boughtTime"
          >
            <b-form-input
              type="datetime-local"
              v-model="form.boughtTime"
              class="form-control"
              id="boughtTime"
              placeholder="Povezava do pesmi"
            />
            <b-badge pill @click="setCurrentTime">Nastavi danes</b-badge>
          </b-form-group>

          <b-form-group
            id="input-group-5"
            label="Število kosov"
            label-for="count"
          >
            <b-form-input
              type="number"
              class="form-control"
              id="count"
              placeholder="1"
              min="1"
              v-model="form.count"
              required
            />
          </b-form-group>

          <b-form-group
            id="input-group-5"
            label="Lokacija"
            label-for="boughtTime"
          >
            <b-form-input
              type="text"
              class="form-control"
              id="location"
              placeholder="Lokacija predmeta"
              v-model="form.location"
              required
            />
          </b-form-group>

          <b-form-group
            id="input-group-6"
            label="Lastnik"
            label-for="owner"
          >
            <b-form-input
              type="text"
              class="form-control"
              id="owner"
              placeholder="Lastnik predmeta"
              v-model="form.owner"
              required
            />
          </b-form-group>

          <b-form-group
            label="Opis"
            label-for="description"
          >
            <b-form-textarea
              id="description"
              v-model="form.description"
              placeholder="Vnesi podrobnosti..."
              rows="3"
              max-rows="6"
            ></b-form-textarea>
          </b-form-group>

          <b-button type="submit" class="btn-primary">Dodaj</b-button>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

import {DateTime} from "luxon";
import status from "@/mixins/status";

export default {
  name: "add.vue",
  components: {},
  mixins: [status],
  data() {
    return {
      form: {
        name: '',
        category: null,
        tags: [],
        count: 1,
        description: '',
        location: '',
        boughtTime: null,
        owner: 'RZS',
        status: null
      },
      tags: [],
      categories: [],
      cover: {
        file: null,
        path: null
      }
    }
  },
  watch: {
    'cover.file': {
      deep: true,
      handler() {
        if (this.cover.file) {
          this.cover.path = URL.createObjectURL(this.cover.file)
        }
        this.form.cover = null;
      }
    },
  },
  async created() {
    await Promise.all([
      this.getCategories(),
      this.getTags(),
    ])
  },
  methods: {
    setCurrentTime() {
      this.form.boughtTime = DateTime.now().toFormat('yyyy-MM-dd') + "T" + DateTime.now().toFormat('hh:mm')
    },
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
    async getTags() {
      this.$axios.$get(`/tags`)
        .then(res => {
          if (res.length) {
            this.tags = res
          }
        })
        .catch(res => {
          console.error(res)
          this.$toast.error('Napaka pri pridobivanju značk', {duration: 10000});
        })
    },
    onReset() {
      console.log('reset here')
    },
    async onSubmit() {

      if (!this.form.name ||
        !this.form.category ||
        !this.form.count ||
        !this.form.boughtTime ||
        !this.form.owner ||
        !this.form.location
      ) {
        this.$toast.error('Napaka v vnosnih poljih', {duration: 2000});
        return;
      }

      await this.$axios.$post('/inventory', this.form
      )
        .then(async (res) => {
          console.log(res)
          if (this.cover.file && res._id) {
            await this.uploadImage(res._id);
          }
          this.$toast.success(`Predmet "${this.form.name}" uspešno dodan`, {duration: 2000});
          await this.$router.replace('/')
        })
        .catch(rej => {
          console.error(rej);
          this.$toast.error('Napaka pri dodajanju predmeta', {duration: 2000});
        });
    },
    async uploadImage(id) {
      const formData = new FormData();
      formData.append('file', this.cover.file);

      await this.$axios.$post(`/inventory/file/${id}`, formData)
    }
  }
}
</script>

<style scoped>
</style>
