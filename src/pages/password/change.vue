<script setup lang="ts">
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth.store'
import { useRoute } from '#vue-router'

const authStore = useAuthStore()
const route = useRoute()

definePageMeta({
  layout: 'tight',
})

const resolveQueryValue = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value ?? '')
const token = computed(() => resolveQueryValue(String(route.query.token)))
const userId = computed(() => resolveQueryValue(String(route.query.userId ?? route.query.user_id)))

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: yup.object({
    password: yup.string().min(6).required(),
    passwordRepeat: yup.string().min(6).required().oneOf([yup.ref('password')], 'Gesla se ne ujemata!'),
  }),
})

const submitError = ref<string | null>(null)
const success = ref(false)
const showPass = ref(false)
const showPassInput = computed(() => {
  return { type: showPass.value ? 'password' : 'text' }
})

const onSubmit = handleSubmit(async (values) => {
  submitError.value = null
  if (!token.value || !userId.value) {
    submitError.value = 'Manjka povezava za ponastavitev gesla.'
    return
  }
  await authStore.changePasswordExternal({
    new_pass: values.password,
    token: token.value,
    user_id: userId.value,
  })
  success.value = true
})

const [password, passwordAttrs] = defineField('password')
const [passwordRepeat, passwordRepeatAttrs] = defineField('passwordRepeat')
</script>

<template>
  <section class="mt-12 px-4">
    <div v-if="success" class="text-center">
      <p class="font-semibold mb-2">Geslo uspešno spremenjeno</p>
      <p class="mb-4">
        Pojdi na
        <a class="link link-primary" href="/login">prijavo</a>.
      </p>
    </div>

    <div v-else>
      <h1 class="text-center mb-8">Spremeni geslo</h1>

      <form @submit.stop.prevent="onSubmit" class="flex flex-col gap-4">
        <div class="form-control">
          <label class="input input-bordered flex items-center gap-2">
            <LockClosedIcon class="w-6" />
            <input v-model="password" v-bind="{ ...passwordAttrs, ...showPassInput }" class="grow" placeholder="Geslo" />
            <button>
              <EyeSlashIcon v-if="showPass" class="w-6" @click="showPass = !showPass" />
              <EyeIcon v-else class="w-6" @click="showPass = !showPass" />
            </button>
          </label>
          <div v-if="errors.password" class="badge badge-error mt-1 w-full">{{ errors.password }}</div>
        </div>

        <div class="form-control">
          <label class="input input-bordered flex items-center gap-2">
            <LockClosedIcon class="w-6" />
            <input
              v-model="passwordRepeat"
              v-bind="{ ...passwordRepeatAttrs, ...showPassInput }"
              class="grow"
              placeholder="Ponovi geslo"
            />
            <button>
              <EyeSlashIcon v-if="showPass" class="w-6" @click="showPass = !showPass" />
              <EyeIcon v-else class="w-6" @click="showPass = !showPass" />
            </button>
          </label>
          <div v-if="errors.passwordRepeat" class="badge badge-error mt-1 w-full">{{ errors.passwordRepeat }}</div>
        </div>

        <button class="btn btn-primary">Spremeni geslo</button>
        <div v-if="submitError" class="badge badge-error w-full">{{ submitError }}</div>
      </form>
    </div>
  </section>
</template>

<style scoped></style>
