<template>
  <div class="card">
    <div class="card-header">
      Featured
    </div>
    <div v-if="item" class="card-body">
      <h5 class="card-title">Card title</h5>
      <div v-for="(value, key) in item"><b>{{ key }}:</b> {{ value }}</div>
      <button @click="editItem" class="btn btn-primary">Uredi</button>
    </div>
  </div>
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
        console.log(res)
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
