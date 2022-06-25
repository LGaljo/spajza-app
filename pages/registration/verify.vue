<template>
  <b-container>
    <b-row>
      <b-col offset-md="3" md="6" cols="12" class="my-3">
        <div class="text-center">
          <h1>Račun potrjen</h1>
          <div>Preusmerjam na prijavo v {{ time }} sekundah.</div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "verify",
  data() {
    return {
      time: 5,
    }
  },
  async created() {
    await this.$axios.$post('/auth/verification', {
      userId: this.$route.query?.userId,
      token: this.$route.query?.token,
    })
      .then(res => {
        setTimeout(() => {
          this.$router.replace('/login');
        }, this.time * 1000);
      })
      .catch(reason => {
        console.error(reason)
        this.$toast.error("Napaka pri zahtevi", { duration: 3000 })
      })
  },
}
</script>

<style scoped>

</style>
