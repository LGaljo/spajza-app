<template>
  <b-container style="height: 66vh">
    <b-row class="h-100">
      <b-col offset-md="3" md="6" cols="12">
        <div class="d-flex flex-column flex-nowrap justify-content-center align-content-center h-100">
          <div class="text-center">
            <h1>ŠPAJZA</h1>
          </div>

          <b-form @submit.stop.prevent="onSubmit">
            <b-input
              type="text"
              v-model="form.username"
              placeholder="Uporabniško ime ali email"
              class="my-2"
            />
            <b-input
              type="password"
              v-model="form.password"
              placeholder="Geslo"
              class="my-2"
            />
            <div v-if="error">
              <div class="text-center text-danger">{{ error }}</div>
              <div v-if="resend_act" class="text-center">
                <a class="btn-link fake-button" @click="resendActivation">Ponovno zahtevaj povezavo</a>
                </div>
            </div>

            <b-form-checkbox
              v-model="form.saveme"
              class="mt-4 text-center"
            >Zapomni se me</b-form-checkbox>

            <div class="text-center mt-4">
              <b-button type="submit" variant="success" class="w-50">
                <b-spinner v-if="loading" small></b-spinner>
                Prijava
              </b-button>
            </div>
          </b-form>

          <div class="text-center mt-4">
            <nuxt-link to="/registration">Nimaš računa?</nuxt-link>
          </div>
          <div class="text-center mt-4">
            <nuxt-link to="/forgotten-password">Pozabljeno geslo?</nuxt-link>
          </div>

        </div>

      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "login",
  data() {
    return {
      error: null,
      resend_act: null,
      form: {
        username: null,
        password: null,
        saveme: false
      },
      loading: false
    }
  },
  methods: {
    ...mapActions({
      login: 'user/login'
    }),
    async onSubmit() {
      this.loading = true
      await this.login(this.form)
        .then(async (res) => {
          this.error = res?.error
          this.resend_act = res?.resend_act
          await this.$router.replace("/")
        })
        .catch((err) => {
          this.error = err?.error
          this.resend_act = err?.resend_act
        })
      this.loading = false
    },
    async resendActivation() {
      await this.$axios.$post('/auth/resend-verification', { userId: this.resend_act})
        .then(() => {
          this.$toast.success("Zahteva uspešno poslana", { duration: 3000 })
        })
        .catch(err => {
          console.error(err)
          this.$toast.error("Napaka pri zahtevi", { duration: 3000 })
        })
    }  }
}
</script>

<style scoped>

</style>
