<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'
import { useRoute } from '#vue-router'
import { onMounted, onBeforeUnmount, ref } from 'vue'

const authStore = useAuthStore()
const route = useRoute()

definePageMeta({
  layout: 'tight',
})

const time = ref(5)
const error = ref<string | null>(null)
let timerId: ReturnType<typeof setInterval> | null = null

const resolveQueryValue = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value ?? '')
const userId = resolveQueryValue(String(route.query.userId))
const token = resolveQueryValue(String(route.query.token))

onMounted(async () => {
  if (!userId || !token) {
    error.value = 'Manjkajo podatki za potrditev računa.'
    return
  }
  timerId = setInterval(() => {
    if (time.value > 0) time.value -= 1
  }, 1000)
  try {
    await authStore.profileVerification({ userId, token })
  } catch {
    error.value = 'Napaka pri zahtevi.'
  }
})

onBeforeUnmount(() => {
  if (timerId) {
    clearInterval(timerId)
  }
})
</script>

<template>
  <section class="mt-12 px-4">
    <div class="text-center">
      <h1 class="mb-4">Račun potrjen</h1>
      <p v-if="!error">Preusmerjam na prijavo v {{ time }} sekundah.</p>
      <div v-if="error" class="badge badge-error mt-4">{{ error }}</div>
    </div>
  </section>
</template>

<style scoped></style>
