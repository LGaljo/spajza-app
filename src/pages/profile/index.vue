<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '~/stores/auth.store'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { EyeIcon, EyeSlashIcon, LockClosedIcon } from '@heroicons/vue/24/solid'
import { _themes as daisyThemes } from '#tailwind-config/daisyui'

definePageMeta({
  layout: 'default',
})

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const colorMode = useColorMode()

const themes = ['system', ...daisyThemes]

const { errors, handleSubmit, defineField, resetForm } = useForm({
  validationSchema: yup.object({
    old_pass: yup.string().required(),
    new_pass: yup.string().min(6).required(),
    new_pass_rep: yup.string().min(6).required().oneOf([yup.ref('new_pass')], 'Gesla se ne ujemata!'),
  }),
})

const showPass = ref(false)
const showPassInput = computed(() => {
  return { type: showPass.value ? 'password' : 'text' }
})

const onSubmit = handleSubmit(async (values) => {
  await authStore.changePassword({
    old_pass: values.old_pass,
    new_pass: values.new_pass,
  })
  resetForm()
})

const [oldPass, oldPassAttrs] = defineField('old_pass')
const [newPass, newPassAttrs] = defineField('new_pass')
const [newPassRep, newPassRepAttrs] = defineField('new_pass_rep')

onMounted(async () => {
  if (!user.value && import.meta.client) {
    const userId = localStorage.getItem('userId')
    if (userId) {
      await authStore.fetchUser(userId)
    }
  }
})
</script>

<template>
  <section class="max-w-3xl mx-auto px-4 py-8">
    <div v-if="user">
      <h1 class="text-3xl font-semibold mb-6">Tvoj profil</h1>

      <div class="space-y-1">
        <div><span class="font-semibold">Uporabniško ime:</span> {{ user.username }}</div>
        <div><span class="font-semibold">Email:</span> {{ user.email }}</div>
        <div><span class="font-semibold">Vloga:</span> {{ user.role }}</div>
      </div>

      <div class="mt-8 max-w-md">
        <h2 class="text-xl font-semibold mb-3">Tema</h2>
        <select v-model="colorMode.preference" class="select select-bordered w-full">
          <option v-for="theme in themes" :key="theme" :value="theme">{{ theme }}</option>
        </select>
      </div>

      <div class="mt-8">
        <h2 class="text-xl font-semibold mb-4">Spremeni geslo</h2>
        <form @submit.stop.prevent="onSubmit" class="flex flex-col gap-3 max-w-md">
          <div class="form-control">
            <label class="input input-bordered flex items-center gap-2">
              <LockClosedIcon class="w-6" />
              <input
                v-model="oldPass"
                v-bind="{ ...oldPassAttrs, ...showPassInput }"
                class="grow"
                placeholder="Staro geslo"
                autocomplete="current-password"
              />
              <button>
                <EyeSlashIcon v-if="showPass" class="w-6" @click="showPass = !showPass" />
                <EyeIcon v-else class="w-6" @click="showPass = !showPass" />
              </button>
            </label>
            <div v-if="errors.old_pass" class="badge badge-error mt-1 w-full">{{ errors.old_pass }}</div>
          </div>

          <div class="form-control">
            <label class="input input-bordered flex items-center gap-2">
              <LockClosedIcon class="w-6" />
              <input
                v-model="newPass"
                v-bind="{ ...newPassAttrs, ...showPassInput }"
                class="grow"
                placeholder="Novo geslo"
                autocomplete="new-password"
              />
              <button>
                <EyeSlashIcon v-if="showPass" class="w-6" @click="showPass = !showPass" />
                <EyeIcon v-else class="w-6" @click="showPass = !showPass" />
              </button>
            </label>
            <div v-if="errors.new_pass" class="badge badge-error mt-1 w-full">{{ errors.new_pass }}</div>
          </div>

          <div class="form-control">
            <label class="input input-bordered flex items-center gap-2">
              <LockClosedIcon class="w-6" />
              <input
                v-model="newPassRep"
                v-bind="{ ...newPassRepAttrs, ...showPassInput }"
                class="grow"
                placeholder="Ponovi geslo"
                autocomplete="new-password"
              />
              <button>
                <EyeSlashIcon v-if="showPass" class="w-6" @click="showPass = !showPass" />
                <EyeIcon v-else class="w-6" @click="showPass = !showPass" />
              </button>
            </label>
            <div v-if="errors.new_pass_rep" class="badge badge-error mt-1 w-full">{{ errors.new_pass_rep }}</div>
          </div>

          <button class="btn btn-primary">Spremeni geslo</button>
          <div v-if="authStore.error" class="badge badge-error w-full">{{ authStore.error }}</div>
        </form>
      </div>
    </div>
  </section>
</template>
