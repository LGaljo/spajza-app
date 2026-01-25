<script setup lang="ts">
import {useAuthStore} from "~/stores/auth.store";
import {useForm} from 'vee-validate';
import * as yup from 'yup';
import {AtSymbolIcon, EyeIcon, EyeSlashIcon, LockClosedIcon} from "@heroicons/vue/24/solid";
import {ref} from "vue";

const authStore = useAuthStore();

definePageMeta({
  layout: 'tight'
})

const {errors, handleSubmit, defineField} = useForm({
  validationSchema: yup.object({
    username: yup.string().required(),
    password: yup.string().min(6).required(),
    saveme: yup.boolean()
  }),
});

const showPass = ref(false);
const showPassInput = computed(() => {
  return { type: showPass.value ? 'password' : 'text' }
})

const doLogin = handleSubmit(values => {
  authStore.login(values)
})

const [username, usernameAttrs] = defineField('username');
const [password, passwordAttrs] = defineField('password');
const [saveme, savemeAttrs] = defineField('saveme');
</script>

<template>
  <section class="container mx-auto mt-12 mb-4">
    <div class="hero min-h-[30rem] bg-base-200 rounded">
      <div class="hero-content text-center">
        <div class="max-w-4xl">
          <h1 class="text-6xl md:text-6xl lg:text-8xl atma-semibold">Špajza</h1>

          <form @submit.stop.prevent="doLogin" class="mt-12 flex flex-col gap-2">
            <div class="form-control">
              <label class="input input-bordered flex items-center gap-2">
                <AtSymbolIcon class="w-6" />
                <input type="text" v-model="username" v-bind="usernameAttrs" class="grow"
                       placeholder="Uporabniško ime ali email"/>
              </label>
              <div v-if="errors.username" class="badge badge-error mt-1 w-full">{{ errors.username }}</div>
            </div>

            <div class="form-control">

              <label class="input input-bordered flex items-center gap-2">
                <LockClosedIcon class="w-6" />
                <input v-bind="{...passwordAttrs, ...showPassInput}" v-model="password" class="grow" placeholder="Geslo"/>
                <button>
                  <EyeSlashIcon v-if="showPass" class="w-6" @click="showPass = !showPass" />
                  <EyeIcon v-else class="w-6" @click="showPass = !showPass" />
                </button>
              </label>
              <div v-if="errors.password" class="badge badge-error mt-1 w-full">{{ errors.password }}</div>
            </div>

            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Zapomni se me</span>
                <input type="checkbox" v-model="saveme" v-bind="savemeAttrs" class="checkbox"/>
              </label>
            </div>

            <button class="btn btn-primary">Prijavi se</button>
            <div v-if="authStore.error" class="badge badge-error w-full">{{ authStore.error }}</div>
            <a class="link link-primary" href="/password/forgotten">Pozabljeno geslo</a>
            <a class="link link-primary" href="/registration">Nimaš računa?</a>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>