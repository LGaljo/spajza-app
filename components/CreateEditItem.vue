<template>
  <div>
    <b-form class="w-100" @submit.prevent="onSubmit">
      <!-- Ime predmeta  -->
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
          accept="image/jpeg, image/png"
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

      <!-- Kategorija -->
      <b-form-group
        id="input-group-2"
        label="Kategorija"
        label-for="category"
      >
        <b-form-select
          v-model="form.categoryId"
          id="category"
          :options="optionsCats"
        >
          <b-form-select-option
            :value="null"
            disabled>
            -- Izberi kategorijo --
          </b-form-select-option>
        </b-form-select>
      </b-form-group>

      <!-- Značke -->
      <b-form-group
        id="input-group-3"
        label="Značke"
        label-for="tags"
      >
        <b-form-select
          v-model="form.tags"
          multiple
          id="tags"
          :options="optionsTags"
        >
          <b-form-select-option
            :value="null"
          >
            -- Izberi značke (neobvezno) --
          </b-form-select-option>
        </b-form-select>
      </b-form-group>

      <!-- STATUS -->
      <b-form-group
        id="input-group-3"
        label="Status"
        label-for="status"
      >
        <b-form-select
          v-model="form.status"
          :options="statuses"
          id="status"
          aria-placeholder="Stanje"
          class="mb-2"
        >
          <b-form-select-option
            :value="null"
            disabled>
            -- Izberi stanje predmeta --
          </b-form-select-option>
        </b-form-select>
      </b-form-group>

      <!-- Čas pridobitve  -->
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
        />
        <b-badge pill @click="setCurrentTime">Nastavi danes</b-badge>
      </b-form-group>

      <!-- Število kosov  -->
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

      <!-- Lokacija  -->
      <b-form-group
        id="input-group-5"
        label="Lokacija"
        label-for="location"
      >
        <b-form-input
          type="text"
          class="form-control"
          id="location"
          placeholder="Lokacija predmeta"
          v-model="form.location"
        />
      </b-form-group>

      <!-- Lastnik  -->
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
        />
      </b-form-group>

      <!-- Opis  -->
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

      <b-button type="submit" class="btn-primary">
        {{ $route.params.id ? 'Shrani' : 'Dodaj' }}
        <b-spinner v-if="loading" variant="light" small />
      </b-button>
    </b-form>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import status from "@/mixins/status";
import {DateTime} from "luxon";

export default {
  mixins: [status],
  data() {
    return {
      form: {
        name: '',
        categoryId: null,
        tags: [],
        count: 1,
        description: '',
        location: 'Plac',
        boughtTime: null,
        owner: 'RZS',
        status: 'NEW'
      },
      cover: {
        file: null,
        path: null
      },
      loading: false,
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
      item: 'item/get',
      categories: 'categories/get',
      optionsCats: 'categories/getOptions',
      tags: 'tags/get',
      optionsTags: 'tags/getOptions',
    }),
  },
  async created() {
    this.setCurrentTime()
    await this.$store.dispatch('categories/fetch');
    await this.$store.dispatch('tags/fetch');

    if (this.$route.params.id) {
      this.fetchItem(this.$route.params.id)
        .then(() => {
          this.form = {
            ...this.item,
            tags: this.item?.tags?.map(t => t?._id),
            boughtTime: DateTime.fromISO(this.item?.boughtTime).toFormat(`yyyy-MM-dd'T'hh:mm`),
            categoryId: this.item?.category?._id,
            category: this.item?.category?.name
          }
          this.cover.path = this.item?.cover?.Location
        })
        .catch(err => {
          console.error(err)
          this.$toast.error('Napaka pri pridobivanju podatkov', { duration: 10000 });
        })
    }
  },
  methods: {
    ...mapActions({
      fetchItem: 'item/fetch',
    }),
    setCurrentTime() {
      this.form.boughtTime = DateTime.fromISO(this.item?.boughtTime).toFormat(`yyyy-MM-dd'T'hh:mm`)
    },
    async onSubmit() {
      this.loading = true;
      if (!this.form.name ||
        !this.form.categoryId ||
        !this.form.count ||
        !this.form.boughtTime
      ) {
        this.$toast.error('Napaka v vnosnih poljih', {duration: 2000});
        return;
      }

      if (this.$route.params.id) {
        this.$axios.$put(`/inventory/${this.$route.params.id}`, {
          ...this.form,
          category: this.form.categoryId,
          boughtTime: new Date(this.form.boughtTime),
        })
          .then(async (res) => {
            if (this.cover.file) {
              await this.uploadImage(this.$route.params.id);
            }
            this.$toast.success(`Predmet "${this.form.name}" uspešno posodobljen`, {duration: 2000});
            await this.$router.replace(`/item/${this.$route.params.id}`)
          })
          .catch(rej => {
            console.error(rej);
          });
      } else {
        await this.$axios.$post('/inventory', {
            ...this.form,
            category: this.form.categoryId,
            boughtTime: new Date(this.form.boughtTime),
          }
        )
          .then(async (res) => {
            if (this.cover.file && res._id) {
              await this.uploadImage(res._id);
            }
            this.$toast.success(`Predmet "${this.form.name}" uspešno dodan`, {duration: 2000});
            await this.$router.replace(`/item/${res._id}`)
          })
          .catch(rej => {
            console.error(rej);
            this.$toast.error('Napaka pri dodajanju predmeta', {duration: 2000});
          });
      }
    },
    async uploadImage(id) {
      const formData = new FormData();
      formData.append('file', this.cover.file);

      try {
        await this.$axios.$post(`/inventory/file/${id}`, formData)
      } catch (reason) {
        console.error(reason);
        this.$toast.error('Napaka pri dodajanju slike', {duration: 2000});
      }
    }
  }
}
</script>

<style scoped>

</style>
