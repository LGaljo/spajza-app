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
          multiple
          accept="image/jpeg, image/png"
          :state="Boolean(cover.file)"
          placeholder="Izberi ali spusti datoteko..."
          drop-placeholder="Spusti datoteko..."
        />
      </b-form-group>
      <div v-if="cover.path" class="my-3">
        <div>Izbrane slike:</div>
        <div class="d-flex flex-row flex-wrap justify-content-center" :key="counter">
          <div v-for="(im, idx) in cover.path" :key="im.path" class="p-2 d-flex flex-column">
            <small v-if="im.file && im.file.name" class="mb-1">{{ im.file.name }}</small>
            <div class="position-relative">
              <b-btn variant="light" @click="popImage(im)" class="position-absolute" href="#">
                <b-icon icon="x-circle-fill"></b-icon>
              </b-btn>
              <b-btn-group class="position-absolute" style="right: 0">
                <b-btn :disabled="idx === 0" variant="light" @click="moveUp(im, idx)" class="">
                  <b-icon icon="arrow-up"></b-icon>
                </b-btn>
                <b-btn :disabled="idx === cover.path.length - 1" variant="light" @click="moveDown(im, idx)" class="">
                  <b-icon icon="arrow-down"></b-icon>
                </b-btn>
              </b-btn-group>
              <b-img :src="im.path" fluid alt="image" width="250"></b-img>
            </div>
          </div>
        </div>
      </div>

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
        <b-badge pill @click="setCurrentTime" href="#">Nastavi danes</b-badge>
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
        <b-spinner v-if="loading" variant="light" small/>
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
  name: 'CreateEditItem',
  data() {
    return {
      form: {
        name: '',
        categoryId: null,
        tags: [],
        count: 1,
        description: '',
        location: 'Plac',
        boughtTime: DateTime.now().toFormat(`yyyy-MM-dd'T'hh:mm`),
        owner: 'RZS',
        status: 'NEW'
      },
      cover: {
        file: [],
        path: []
      },
      loading: false,
      imagesToRemove: [],
      counter: 0,
    }
  },
  watch: {
    'cover.file': {
      deep: true,
      handler() {
        if (this.cover.file) {

          this.cover.path = [
            ...this.cover.path ?? [],
            ...this.cover.file.map(f => ({
              path: URL.createObjectURL(f),
              file: f,
            }))]
        }
        this.form.cover = null;
      }
    },
  },
  computed: {
    ...mapGetters({
      item: 'item/get',
      categories: 'categories/getList',
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
          // this.cover.path = this.item?.cover?.Location
          this.cover.path = this.item?.cover?.map(c => ({
            path: c?.Location,
            file: {
              name: c?.Location.split('/').slice(-1)[0]
            },
            obj: c
          }))
        })
        .catch(err => {
          console.error(err)
          this.$toast.error('Napaka pri pridobivanju podatkov', {duration: 10000});
        })
    }
  },
  methods: {
    ...mapActions({
      fetchItem: 'item/fetch',
      removeImage: 'item/removeImage',
      uploadImage: 'item/addImage'
    }),
    setCurrentTime() {
      this.form.boughtTime = DateTime.now().toFormat(`yyyy-MM-dd'T'hh:mm`)
    },
    moveUp(im, idx) {
      const tmp = Object.assign({}, this.cover.path[idx])
      this.cover.path[idx] = this.cover.path[idx-1]
      this.cover.path[idx-1] = tmp
      this.counter++
    },
    moveDown(im, idx) {
      const tmp = Object.assign({}, this.cover.path[idx])
      this.cover.path[idx] = this.cover.path[idx+1]
      this.cover.path[idx+1] = tmp
      this.counter++
    },
    async onSubmit() {
      this.loading = true;
      if (!this.form.name ||
        !this.form.categoryId ||
        !this.form.count ||
        !this.form.boughtTime
      ) {
        this.$toast.error('Napaka v vnosnih poljih', {duration: 2000});
        this.loading = false;
        return;
      }

      if (this.$route.params.id) {
        this.$axios.$put(`/inventory/${this.$route.params.id}`, {
          ...this.form,
          category: this.form.categoryId,
          boughtTime: new Date(this.form.boughtTime),
          cover: this.cover?.path?.map(c => c.obj).filter(c => !!c)
        })
          .then(async (res) => {
            if (this.cover.path) {
              for (const im of this.cover?.path) {
                // Check if new
                if (!Object.hasOwn(im, 'obj') && !im?.obj?.key) {
                  await this.uploadImage({file: im.file, id: this.$route.params.id});
                }
              }
            }
            if (this.imagesToRemove.length) {
              for (const im of this.imagesToRemove) {
                await this.removeImage({key: im, id: this.$route.params.id})
              }
            }
            this.$toast.success(`Predmet "${this.form.name}" uspešno posodobljen`, {duration: 2000});
            // await this.$router.replace(`/item/${this.$route.params.id}`)
            await this.$router.back()
          })
          .catch(rej => {
            console.error(rej);
          })
          .finally(() => {
            this.loading = false;
          })
      } else {
        await this.$axios.$post('/inventory', {
            ...this.form,
            category: this.form.categoryId,
            boughtTime: new Date(this.form.boughtTime),
          }
        )
          .then(async (res) => {
            if (this.cover.path && res?._id) {
              for (const im of this.cover?.path) {
                // Check if new
                if (!im?.obj?.key) {
                  await this.uploadImage({file: im.file, id: res?._id});
                }
              }
            }
            this.$toast.success(`Predmet "${res?.name}" uspešno dodan`, {duration: 2000});
            // await this.$router.back()
            await this.$router.replace(`/item/${res._id}`)
          })
          .catch(rej => {
            console.error(rej);
            this.$toast.error('Napaka pri dodajanju predmeta', {duration: 2000});
          })
          .finally(() => {
            this.loading = false;
          })
      }
    },
    popImage(im) {
      if (im?.obj?.key) {
        this.imagesToRemove.push(im?.obj.key)
      }
      this.cover.path = this.cover.path.filter(p => p.path !== im.path)
    }
  }
}
</script>

<style scoped>

</style>
