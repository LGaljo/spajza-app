<template>
  <b-container>
    <b-row>
      <b-col offset-md="3" md="6" cols="12" class="my-3">
        <div class="text-center">
          <h1>Registracija</h1>
        </div>
        <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
          <b-form @submit.stop.prevent="handleSubmit(onSubmit)" class="mt-4">
            <ValidationProvider
              name="uporabniško ime"
              :rules="{ required: true, min: 4 }"
              v-slot="v"
            >
              <b-form-group
                id="input-group-1"
                label="Uporabniško ime"
                label-for="username"
              >
                <b-form-input
                  type="text"
                  id="username"
                  placeholder="Vnesi ime"
                  v-model="form.username"
                  :state="getValidationState(v)"
                  aria-describedby="input-1-live-feedback"
                />
                <b-form-invalid-feedback id="input-1-live-feedback">{{
                    v.errors[0]
                  }}
                </b-form-invalid-feedback>
              </b-form-group>
            </ValidationProvider>

            <ValidationProvider name="elektronski naslov" :rules="{ required: true, email: true }" v-slot="v">
              <b-form-group
                id="input-group-5"
                label="Elektronski naslov"
                label-for="email"
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

            <ValidationProvider name="geslo" :rules="{ required: true }" v-slot="v" vid="password">
              <b-form-group
                id="input-group-6"
                label="Geslo"
                label-for="password"
              >
                <b-form-input
                  type="password"
                  id="password"
                  placeholder="Geslo"
                  v-model="form.password"
                  :state="getValidationState(v)"
                  aria-describedby="input-3-live-feedback"
                />
                <b-form-invalid-feedback id="input-3-live-feedback">{{
                    v.errors[0]
                  }}
                </b-form-invalid-feedback>
              </b-form-group>
            </ValidationProvider>

            <ValidationProvider name="potrditev gesla" :rules="{required: true, confirmed: 'password'}" v-slot="v">
              <b-form-group
                label="Ponovi geslo"
                label-for="pass_repeat"
              >
                <b-form-input
                  type="password"
                  id="pass_repeat"
                  placeholder="Geslo"
                  v-model="form.passwordRepeat"
                  :state="getValidationState(v)"
                  aria-describedby="input-4-live-feedback"
                />
                <b-form-invalid-feedback id="input-4-live-feedback">{{
                    v.errors[0]
                  }}
                </b-form-invalid-feedback>
              </b-form-group>
            </ValidationProvider>

            <div v-if="error" class="text-center text-danger">{{ error }}</div>
            <div class="text-center">
              <b-button type="submit" variant="primary" class="w-50 mt-3">Vpiši se</b-button>
            </div>
          </b-form>
        </ValidationObserver>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "registration",
  data() {
    return {
      error: null,
      form: {
        username: null,
        email: null,
        password: null,
        passwordRepeat: null,
      },
    }
  },
  methods: {
    getValidationState({dirty, validated, valid = null}) {
      return dirty || validated ? valid : null;
    },
    async onSubmit() {
      await this.$axios.$post('/users', {
        username: this.form.username,
        email: this.form.email,
        password: this.form.password
      })
      .then(async res => {
        if (!res.success) {
          if (res?.code === 11000 && res?.key?.hasOwnProperty('email')) {
            this.error = `Uporabnik z emailom "${res?.key?.email}" že obstaja`;
          } else if (res?.code === 11000 && res?.key?.hasOwnProperty('username')) {
            this.error = `Uporabnik z uporabniškim imenom "${res?.key?.username}" že obstaja`;
          }
        } else {
          await this.$router.replace({ path: '/registration/complete', query: { userId: res?.user?._id }})
        }
      })
    },
    async onReset() {
      this.form = {
        username: null,
        email: null,
        password: null,
        passwordRepeat: null,
      };
    },
  }
}
</script>

<style scoped>

</style>
