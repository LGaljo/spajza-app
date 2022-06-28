<template>
  <b-container>
    <b-row>
      <b-col offset-md="3" md="6" cols="12" class="my-3">
        <h1>Ponastavi geslo računa</h1>
        <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
          <b-form class="mt-3" @submit.stop.prevent="handleSubmit(onSubmit)">
            <div :slot="'default'">
              <ValidationProvider name="elektronski naslov" :rules="{ required: true, email: true }" v-slot="v">
                <b-form-group
                  id="input-group-5"
                  label-for="email"
                  label="Na vnešeni račun boš dobil povezavo za ponastavitev gesla"
                >
                  <b-form-input
                    type="text"
                    id="email"
                    placeholder="Elektronski naslov"
                    v-model="form.email"
                    :state="getValidationState(v)"
                    aria-describedby="input-2-live-feedback"
                  />
                  <b-form-invalid-feedback id="input-2-live-feedback">{{
                      v.errors[0]
                    }}
                  </b-form-invalid-feedback>
                </b-form-group>
              </ValidationProvider>

              <div class="float-right">
                <b-button type="submit">Zahtevaj ponastavitev</b-button>
              </div>
            </div>
          </b-form>
        </ValidationObserver>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "forgotten-password",
  data() {
    return {
      form: {
        email: null,
      }
    }
  },
  methods: {
    getValidationState({dirty, validated, valid = null}) {
      return dirty || validated ? valid : null;
    },
    async onSubmit() {
      await this.$axios.$post('/auth/request-password-change', {
        email: this.form.email,
      })
        .then(async res => {
          if (!res.success) {
          } else {
            this.$toast.success("Zahteva uspešno poslana", { duration: 3000 })
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
