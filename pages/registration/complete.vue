<template>
  <b-container>
    <b-row>
      <b-col offset-md="3" md="6" cols="12" class="my-3">
        <div class="text-center">
          <h1>Hvala za registracijo</h1>
          <div class="pt-3">Na email si prejel povezavo za aktivacijo uporabniškega računa.</div>
          <div>V kolikor sporočila še nisi prejel, lahko zahtevaš <a class="btn-link fake-button" @click="resendActivation">novo sporočilo</a>.</div>
        </div>
      </b-col>
    </b-row>
  </b-container>

</template>

<script>
export default {
  name: "complete",
  methods: {
    async resendActivation() {
      await this.$axios.$post('/auth/resend-verification', { userId: this.$route.query?.userId})
        .then(res => {
          this.$toast.success("Zahteva uspešno poslana", { duration: 3000 })
        })
        .catch(reason => {
          console.error(reason)
          this.$toast.error("Napaka pri zahtevi", { duration: 3000 })
        })
    }
  }
}
</script>

<style scoped>

</style>
