<template>
  <b-container>
    <b-row>
      <b-col offset-md="3" md="6" cols="12" class=" my-3">
        <h1>Uredi predmet</h1>
        <b-form class="w-100" @submit.prevent="onSubmit" @reset="onReset">

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

          <!-- KATEGORIJA -->
          <b-form-group
            id="input-group-2"
            label="Kategorija"
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
      },
      tags: [],
      categories: [],
    }
  },
  // watch: {
  //   'form.category'() {
  //     console.log(this.form.category);
  //   }
  // },
  async created() {
    await Promise.all([
      this.getCategories(),
      this.getTags(),
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
        !this.form.categoryId ||
        !this.form.count ||
        !this.form.boughtTime ||
        !this.form.owner ||
        !this.form.location
      ) {
        this.$toast.error('Napaka v vnosnih poljih', {duration: 2000});
        return;
      }

      await this.$axios.$put(`/inventory/${this.$route.params.id}`, {
        ...this.form,
        boughtTime: new Date(this.form.boughtTime),
      })
        .then(res => {
          this.$toast.success(`Predmet "${this.form.name}" uspešno posodobljen`, {duration: 2000});
          this.$router.replace('/')
        })
        .catch(rej => {
          console.error(rej);
          this.$toast.error('Napaka pri dodajanju predmeta', {duration: 2000});
        });
    }
  }
}
</script>

<style scoped>
</style>
