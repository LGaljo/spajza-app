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
  return { type: showPass.value ? 'text' : 'password' }
})

const [email, emailAttrs] = defineField('email');
const [username, usernameAttrs] = defineField('username');
const [password, passwordAttrs] = defineField('password');
const [passwordRepeat, passwordRepeatAttrs] = defineField('passwordRepeat');
</script>

<template>
  <section class="mt-12 px-4">
    <h1 class="text-center mb-8">Registracija</h1>

    <form @submit.stop.prevent="onSubmit" class="flex flex-col gap-4" autocomplete="on">
      <div class="form-control">
        <label class="input input-bordered flex items-center gap-2">
          <UserIcon class="w-6" />
          <input id="reg-username" name="username" type="text" autocomplete="username" v-model="username" v-bind="usernameAttrs" class="grow"
                 placeholder="Uporabniško ime"/>
        </label>
        <div v-if="errors.username" class="badge badge-error mt-1 w-full">{{ errors.username }}</div>
      </div>

      <div class="form-control">
        <label class="input input-bordered flex items-center gap-2">
          <AtSymbolIcon class="w-6" />
          <input id="reg-email" name="email" type="email" autocomplete="email" v-model="email" v-bind="emailAttrs" class="grow"
                 placeholder="Elektronski naslov"/>
        </label>
        <div v-if="errors.email" class="badge badge-error mt-1 w-full">{{ errors.email }}</div>
      </div>

      <div class="form-control">
        <label class="input input-bordered flex items-center gap-2">
          <LockClosedIcon class="w-6" />
          <input id="reg-password" name="password" autocomplete="new-password" v-model="password" v-bind="{...passwordAttrs, ...showPassInput}" class="grow"
                 placeholder="Geslo"/>
          <button type="button" @click.stop.prevent="showPass = !showPass" class="focus:outline-none">
            <EyeSlashIcon v-if="showPass" class="w-6" />
            <EyeIcon v-else class="w-6" />
          </button>
        </label>
        <div v-if="errors.password" class="badge badge-error mt-1 w-full">{{ errors.password }}</div>
      </div>

      <div class="form-control">
        <label class="input input-bordered flex items-center gap-2">
          <LockClosedIcon class="w-6" />
          <input id="reg-password-repeat" name="passwordRepeat" autocomplete="new-password" v-model="passwordRepeat" v-bind="{...passwordRepeatAttrs, ...showPassInput}" class="grow"
                 placeholder="Ponovi geslo"/>
          <button type="button" @click.stop.prevent="showPass = !showPass" class="focus:outline-none">
            <EyeSlashIcon v-if="showPass" class="w-6" />
            <EyeIcon v-else class="w-6" />
          </button>
        </label>
        <div v-if="errors.passwordRepeat" class="badge badge-error mt-1 w-full">{{ errors.passwordRepeat }}</div>
      </div>


      <button class="btn btn-primary" type="submit">Registriraj se</button>
      <div v-if="userStore.error" class="badge badge-error w-full">{{ userStore.error }}</div>
    </form>

  </section>
</template>

<style scoped>

</style>