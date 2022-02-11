<template>
  <b-container>
    <b-row>
      <b-col offset-md="3" md="6" cols="12" class=" my-3">
        <h1>Uredi predmet</h1>
        <b-form class="w-100" @submit.prevent="onSubmit">

          <!-- IME -->
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

          <!-- KATEGORIJA -->
          <b-form-group
            id="input-group-2"
            label="Kategorije"
            label-for="category"
          >
            <b-form-radio-group
              v-model="form.categoryId"
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

          <!-- ZNAČKE -->
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

          <!-- ČAS PRIDOBITVE -->
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

          <!-- ŠTEVILO KOSOV -->
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

          <!-- LOKACIJA -->
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

          <!-- LASTNIK -->
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

          <!-- OPIS -->
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

          <b-button type="submit" class="btn-primary">Shrani</b-button>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

import {DateTime} from "luxon";
import status from "@/mixins/status";
import {mapGetters} from "vuex";

export default {
  name: "edit.vue",
  components: {},
  mixins: [status],
  data() {
    return {
      form: {
        name: '',
        categoryId: null,
        tags: [],
        count: 1,
        description: '',
        location: '',
        boughtTime: null,
        owner: 'RZS',
        cover: null,
      },
      cover: {
        file: null,
        path: null,
      },
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
  computed: {
    ...mapGetters({
      categories: 'categories/get',
      tags: 'tags/get',
    })
  },
  async created() {
    await Promise.all([
      this.$store.dispatch('categories/fetch'),
      this.$store.dispatch('tags/fetch'),
    ])
    await this.getItem();
  },
  methods: {
    setCurrentTime() {
      this.form.boughtTime = DateTime.now().toFormat('yyyy-MM-dd') + "T" + DateTime.now().toFormat('hh:mm')
    },
    async getItem() {
      await this.$axios.$get(`/inventory/${this.$route.params.id}`)
        .then(res => {
          this.form = res
          this.form.name = res.name
          this.form.categoryId = res.categoryId
          this.form.tags = res.tags.map(t => t._id)
          this.form.count = res.count || null
          this.cover.path = res.cover ? res.cover.Location : null
          this.form.description = res.description || null
          this.form.location = res.location || null
          this.form.boughtTime = DateTime.fromISO(res.boughtTime).toFormat('yyyy-MM-dd') +
            "T" + DateTime.fromISO(res.boughtTime).toFormat('hh:mm')
          this.form.owner = res.owner || null
          this.form.status = res.status || null
        })
        .catch(res => {
          console.error(res)
          this.$toast.error('Napaka pri pridobivanju podatkov', { duration: 10000 });
        })
    },
    async onSubmit() {

      if (!this.form.name ||
        !this.form.categoryId ||
        !this.form.count ||
        !this.form.boughtTime ||
        !this.form.owner ||
        !this.form.location
      ) {
        this.$toast.error('Napaka v vnosnih poljih', {duration: 2000});
        return;
      }

      this.$axios.$put(`/inventory/${this.$route.params.id}`, {
        ...this.form,
        boughtTime: new Date(this.form.boughtTime),
      })
      .then(async (res) => {
        if (this.cover.file) {
          await this.uploadImage();
        }
        this.$toast.success(`Predmet "${this.form.name}" uspešno posodobljen`, {duration: 2000});
        await this.$router.replace('/')
      })
      .catch(rej => {
        console.error(rej);
      });
    },
    async uploadImage() {
      const formData = new FormData();
      formData.append('file', this.cover.file);

      await this.$axios.$post(`/inventory/file/${this.$route.params.id}`, formData)
    }
  }
}
</script>

<style scoped>
</style>
