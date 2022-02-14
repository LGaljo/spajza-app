<template>
  <b-modal ref="dialog" :title="'Izposodi'" hide-footer>
    <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
      <b-form @submit.stop.prevent="handleSubmit(onSubmit)">
        <div :slot="'default'">
          <ValidationProvider
            name="date"
            :rules="{ required: true }"
            v-slot="v"
          >
            <div>
              Kdaj boš vrnil <b>{{ item.name }}</b>?
            </div>
            <b-form-group
              id="input-group-1"
            >
              <b-form-datepicker
                id="datepicker-placeholder"
                v-model="form.returnTime"
                :state="getValidationState(v)"
                placeholder="Izberi datum"
                aria-describedby="input-1-live-feedback"
                locale="sl"
                class="mt-3"/>
              <b-form-invalid-feedback id="input-1-live-feedback">{{
                  v.errors[0]
                }}
              </b-form-invalid-feedback>
            </b-form-group>

          </ValidationProvider>

          <ValidationProvider
            name="renter"
            :rules="{ required: true }"
            v-slot="v"
          >
            <b-form-group
              id="input-group-2"
              label="Izposojam:"
              label-for="renter"
              multiple="false"
            >
              <b-form-radio-group
                v-model="form.renter"
                :state="getValidationState(v)"
                id="renter"
                aria-describedby="input-2-live-feedback"
              >
                <b-form-radio :value="'me'">Zase</b-form-radio>
                <b-form-radio :value="'other'">Za drugega</b-form-radio>
              </b-form-radio-group>
              <b-form-invalid-feedback id="input-2-live-feedback">{{
                  v.errors[0]
                }}
              </b-form-invalid-feedback>
            </b-form-group>
          </ValidationProvider>

          <ValidationProvider
            v-show="form.renter === 'other'"
            name="izposojevalec"
            :rules="{ required: form.renter === 'other' }"
            v-slot="v"
          >
            <b-form-group
              id="input-group-3"
              label="Komu?"
              label-for="forwhom"
            >
              <b-form-input
                id="forwhom"
                v-model="form.subject"
                :state="getValidationState(v)"
                aria-describedby="input-3-live-feedback"
              />
              <b-form-invalid-feedback id="input-3-live-feedback">{{
                  v.errors[0]
                }}
              </b-form-invalid-feedback>
            </b-form-group>
          </ValidationProvider>

          <div class="float-right">
            <b-button
              variant="success"
              type="submit"
            >
              Izposodi si
            </b-button>
            <b-button @click="close">Zapri</b-button>
          </div>
        </div>
      </b-form>
    </ValidationObserver>
  </b-modal>
</template>

<script>
import {DateTime} from "luxon";

export default {
  props: {},
  data() {
    return {
      item: {},
      form: {
        returnTime: DateTime.now().plus({days: 14}).toFormat("yyyy-MM-dd"),
        renter: 'me',
        subject: null
      }
    }
  },
  computed: {
  },
  created() {
    this.form.returnTime = DateTime.now().plus({days: 14}).toFormat("yyyy-MM-dd")
  },
  methods: {
    getValidationState({dirty, validated, valid = null}) {
      return dirty || validated ? valid : null;
    },
    async onSubmit() {
      this.$axios.$post(`/rents/borrow/${this.item._id}`, this.form)
        .then(async res => {
          console.log(res);
          this.$emit('onRented', res)
        })
        .catch(reason => {
          console.error(reason)
        })
      this.close();
    },
    async onReset() {
      this.form = {
        returnTime: DateTime.now().plus({days: 14}).toFormat("yyyy-MM-dd"),
        renter: 'me',
        subject: null
      };
    },
    open(item) {
      this.item = item
      this.$refs.dialog.show()
    },
    close() {
      this.onReset();
      this.$refs.dialog.hide()
    },
  }
}
</script>

<style scoped>
.modals > footer {
  display: none !important;
}
.modal-footer {
  display: none !important;
}
</style>
