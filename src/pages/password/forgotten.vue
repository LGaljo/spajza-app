<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { AtSymbolIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'

const authStore = useAuthStore()

definePageMeta({
  layout: 'tight',
})

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required(),
  }),
})

const success = ref(false)
const onSubmit = handleSubmit(async (values) => {
  await authStore.requestPasswordChange(values)
  success.value = true
})

const [email, emailAttrs] = defineField('email')
</script>

<template>
  <section class="mt-12 px-4">
    <h1 class="text-center mb-4">Ponastavi geslo računa</h1>
    <p v-if="!success" class="mb-6 text-center">
      Na vnešeni račun boš dobil povezavo za ponastavitev gesla.
    </p>

    <div v-if="success" class="text-center">
      <p class="font-semibold mb-2">Zahteva uspešno poslana</p>
      <p>Preveri email in sledi povezavi za ponastavitev gesla.</p>
    </div>

    <form v-else @submit.stop.prevent="onSubmit" class="flex flex-col gap-2">
      <div class="form-control">
        <label class="input input-bordered flex items-center gap-2">
          <AtSymbolIcon class="w-6" />
          <input type="text" v-model="email" v-bind="emailAttrs" class="grow" placeholder="Elektronski naslov" />
        </label>
        <div v-if="errors.email" class="badge badge-error my-2">{{ errors.email }}</div>
      </div>

      <button class="btn btn-primary">Zahtevaj ponastavitev</button>
      <div v-if="authStore.error" class="badge badge-error w-full">{{ authStore.error }}</div>
    </form>
  </section>
</template>

<style scoped></style>
