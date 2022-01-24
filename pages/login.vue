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

            <div class="text-center">
              <b-button type="submit" variant="success" class="w-50 mt-4">
                <b-spinner v-if="loading" small></b-spinner>
                Prijava
              </b-button>
            </div>
          </b-form>

          <div class="text-center mt-4">
            <nuxt-link to="/register">Nimaš računa?</nuxt-link>
          </div>

        </div>

      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapMutations, mapActions } from "vuex";

export default {
  name: "login",
  data() {
    return {
      form: {
        username: null,
        password: null,
        loading: false,
      },
      loading: false
    }
  },

  methods: {
    ...mapMutations(["user/setUser", "user/setToken"]),
    ...mapActions(["user/fetchUser", "user/unsetUser"]),
    async onSubmit() {
      this.loading = true

      this.$axios.$post('/auth/login', this.form)
      .then(async res => {
        console.log(res)
        localStorage.setItem('jwt', res.access_token)
        localStorage.setItem('userId', res.userId)
        await this.$store.commit('user/setToken', res.access_token)
        await this.$store.dispatch('user/fetchUser', res.userId)
        await this.$router.push("/");
      })
      .catch(reason => {
        console.error(reason)
        this.$toast.error("Napaka pri prijavi", { duration: 3000 })
      })

      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
