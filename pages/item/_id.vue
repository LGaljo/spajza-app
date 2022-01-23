<template>
  <b-container>
    <b-row>
      <b-col offset-md="3" md="6" cols="12" class=" my-3">
        <div class="card">
          <div class="card-header">
            <nuxt-link :to="`/edit/${this.$route.params.id}`" class="btn btn-primary">Uredi</nuxt-link>
            <nuxt-link :to="`/edit/${this.$route.params.id}`" class="btn btn-danger">Izbriši</nuxt-link>
          </div>
          <div v-if="item" class="card-body">
            <h5 class="card-title">{{ item.name }}</h5>
            <div v-for="(value, key) in item"><b>{{ key }}:</b> {{ value }}</div>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>

</template>

<script>
export default {
  name: "Item",
  data() {
    return {
      item: null
    }
  },
  async created() {
    await this.$axios.$get(`/inventory/${this.$route.params.id}`)
      .then(res => {
        this.item = res;
      })
      .catch(res => {
        console.error(res)
        this.$toast.error('Napaka pri pridobivanju podatkov', { duration: 10000 });
      })

  },
  methods: {
    async editItem() {

    }
  }
}
</script>

<style scoped>

</style>
