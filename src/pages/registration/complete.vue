<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'
import { useRoute } from '#vue-router'
import { ref } from 'vue'

const authStore = useAuthStore()
const route = useRoute()

definePageMeta({
  layout: 'tight',
})

const userId = computed(() => {
  const value = route.query.userId
  return Array.isArray(value) ? value[0] : value ?? ''
})

const sending = ref(false)
const resendError = ref<string | null>(null)
const resendSuccess = ref(false)

const resendActivation = async () => {
  resendError.value = null
  resendSuccess.value = false
  if (!userId.value) {
    resendError.value = 'Manjka ID uporabnika.'
    return
  }
  sending.value = true
  try {
    await authStore.resendProfileVerification(userId.value)
    resendSuccess.value = true
  } catch {
    resendError.value = 'Napaka pri zahtevi.'
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <section class="mt-12 px-4">
    <div class="text-center">
      <h1 class="mb-4">Hvala za registracijo</h1>
      <p class="mb-2">Na email si prejel povezavo za aktivacijo uporabniškega računa.</p>
      <p>
        V kolikor sporočila še nisi prejel, lahko zahtevaš
        <button class="link link-primary" :disabled="sending" @click="resendActivation">novo sporočilo</button>.
      </p>
      <div v-if="resendSuccess" class="badge badge-success mt-4">Zahteva uspešno poslana</div>
      <div v-if="resendError" class="badge badge-error mt-4">{{ resendError }}</div>
    </div>
  </section>
</template>

<style scoped></style>
