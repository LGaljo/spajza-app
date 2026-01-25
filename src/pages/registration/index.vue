<script setup lang="ts">
import {useForm} from 'vee-validate';
import * as yup from 'yup';
import { AtSymbolIcon, LockClosedIcon, UserIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid'
import {useUserStore} from "~/stores/users.store";
import {ref} from "vue";

const userStore = useUserStore();

definePageMeta({
  layout: 'tight'
})

const {errors, handleSubmit, defineField} = useForm({
  validationSchema: yup.object({
    username: yup.string().required().min(4),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
    passwordRepeat: yup.string().min(6).required().oneOf([yup.ref('password')], "Gesla se ne ujemata!"),
  }),
});

const onSubmit = handleSubmit(values => {
  userStore.registration(values)
})

const showPass = ref(false);
const showPassInput = computed(() => {
  return { type: showPass.value ? 'password' : 'text' }
})

const [email, emailAttrs] = defineField('email');
const [username, usernameAttrs] = defineField('username');
const [password, passwordAttrs] = defineField('password');
const [passwordRepeat, passwordRepeatAttrs] = defineField('passwordRepeat');
</script>

<template>
  <section class="mt-12 px-4">
    <h1 class="text-center mb-8">Registracija</h1>

    <form @submit.stop.prevent="onSubmit" class="flex flex-col gap-4">
      <div class="form-control">
        <label class="input input-bordered flex items-center gap-2">
          <UserIcon class="w-6" />
          <input type="text" v-model="username" v-bind="usernameAttrs" class="grow"
                 placeholder="Uporabniško ime"/>
        </label>
        <div v-if="errors.username" class="badge badge-error mt-1 w-full">{{ errors.username }}</div>
      </div>

      <div class="form-control">
        <label class="input input-bordered flex items-center gap-2">
          <AtSymbolIcon class="w-6" />
          <input type="text" v-model="email" v-bind="emailAttrs" class="grow"
                 placeholder="Elektronski naslov"/>
        </label>
        <div v-if="errors.email" class="badge badge-error mt-1 w-full">{{ errors.email }}</div>
      </div>

      <div class="form-control">
        <label class="input input-bordered flex items-center gap-2">
          <LockClosedIcon class="w-6" />
          <input v-model="password" v-bind="{...passwordAttrs, ...showPassInput}" class="grow"
                 placeholder="Geslo"/>
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
          <input v-model="passwordRepeat" v-bind="{...passwordRepeatAttrs, ...showPassInput}" class="grow"
                 placeholder="Ponovi geslo"/>
          <button>
            <EyeSlashIcon v-if="showPass" class="w-6" @click="showPass = !showPass" />
            <EyeIcon v-else class="w-6" @click="showPass = !showPass" />
          </button>
        </label>
        <div v-if="errors.passwordRepeat" class="badge badge-error mt-1 w-full">{{ errors.passwordRepeat }}</div>
      </div>


      <button class="btn btn-primary">Registriraj se</button>
      <div v-if="userStore.error" class="badge badge-error w-full">{{ userStore.error }}</div>
    </form>

  </section>
</template>

<style scoped>

</style>