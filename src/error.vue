<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const router = useRouter()

const statusCode = computed(() => Number(props.error?.status ?? 500))
const isNotFound = computed(() => statusCode.value === 404)
const title = computed(() => (isNotFound.value ? 'Page not found' : 'Unexpected error'))
const message = computed(() =>
  isNotFound.value
    ? 'The page you are looking for does not exist or has been moved.'
    : 'Something went wrong on our side. Please try again in a moment.'
)

useHead(() => ({
  title: isNotFound.value ? 'Page not found' : 'Error',
}))

const errorUrl = computed(() =>
  typeof props.error?.url === 'string' && props.error.url.length > 0 ? props.error.url : 'Unknown'
)

const goHome = () => clearError({ redirect: '/' })
const goBack = () => {
  clearError()
  if (import.meta.client && window.history.length > 1) {
    router.back()
    return
  }
  router.push('/')
}
</script>

<template>
  <section class="nf-theme">
    <div class="nf-backdrop" aria-hidden="true">
      <div class="nf-orb nf-orb--a"></div>
      <div class="nf-orb nf-orb--b"></div>
      <div class="nf-orb nf-orb--c"></div>
      <div class="nf-grid"></div>
    </div>

    <div class="nf-shell">
      <div class="nf-card">
        <div class="nf-status">
          <span class="nf-status__dot"></span>
          <span class="nf-status__text">Error {{ statusCode }}</span>
        </div>

        <h1 class="nf-title atma-semibold">{{ title }}</h1>
        <p class="nf-message">{{ message }}</p>

        <div class="nf-actions">
          <button type="button" class="btn btn-primary nf-btn" @click="goHome">Go home</button>
          <button type="button" class="btn btn-ghost nf-btn-ghost" @click="goBack">Go back</button>
        </div>

        <div v-if="errorUrl" class="nf-path">
          <span class="nf-path__label">Requested URL</span>
          <span class="nf-path__value">{{ errorUrl }}</span>
        </div>
      </div>

      <div class="nf-figure" aria-hidden="true">
        <div class="nf-planet">
          <span class="nf-ring"></span>
          <span class="nf-ring nf-ring--thin"></span>
        </div>
        <div class="nf-ghost">{{ statusCode }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.nf-theme {
  --nf-ink: #1d1f2a;
  --nf-paper: #f7f1e6;
  --nf-sky: #b9e0d3;
  --nf-sun: #f7c58b;
  --nf-coral: #f08b72;
  --nf-leaf: #7bb99e;
  min-height: 100vh;
  background:
    radial-gradient(60% 80% at 0% 0%, rgba(247, 197, 139, 0.45), transparent 60%),
    radial-gradient(50% 70% at 100% 0%, rgba(185, 224, 211, 0.55), transparent 60%),
    radial-gradient(40% 50% at 80% 100%, rgba(240, 139, 114, 0.3), transparent 60%),
    var(--nf-paper);
  color: var(--nf-ink);
  position: relative;
  overflow: hidden;
}

.nf-backdrop {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.nf-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(transparent 0, rgba(29, 31, 42, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, transparent 0, rgba(29, 31, 42, 0.06) 1px, transparent 1px);
  background-size: 120px 120px;
  mask-image: radial-gradient(circle at 50% 40%, black 0%, transparent 70%);
  opacity: 0.5;
}

.nf-orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(2px);
  opacity: 0.9;
  animation: float 9s ease-in-out infinite;
}

.nf-orb--a {
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, rgba(247, 197, 139, 0.9), rgba(247, 197, 139, 0));
  top: -60px;
  left: -40px;
}

.nf-orb--b {
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, rgba(185, 224, 211, 0.85), rgba(185, 224, 211, 0));
  top: 10%;
  right: -100px;
  animation-delay: -3s;
}

.nf-orb--c {
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(123, 185, 158, 0.7), rgba(123, 185, 158, 0));
  bottom: -80px;
  left: 20%;
  animation-delay: -5s;
}

.nf-shell {
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 72px 24px;
  display: grid;
  gap: 48px;
  align-items: center;
}

.nf-card {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 28px;
  padding: 36px;
  box-shadow: 0 25px 60px rgba(29, 31, 42, 0.18);
  backdrop-filter: blur(6px);
  animation: rise 0.6s ease-out both;
}

.nf-status {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(29, 31, 42, 0.08);
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.nf-status__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--nf-coral);
  box-shadow: 0 0 12px rgba(240, 139, 114, 0.7);
}

.nf-title {
  font-size: clamp(2.5rem, 4vw, 4.2rem);
  margin: 18px 0 12px;
}

.nf-message {
  font-size: 1.05rem;
  max-width: 480px;
  color: rgba(29, 31, 42, 0.75);
}

.nf-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.nf-btn {
  min-width: 160px;
}

.nf-btn-ghost {
  border: 1px solid rgba(29, 31, 42, 0.2);
}

.nf-path {
  margin-top: 28px;
  font-size: 0.9rem;
  display: grid;
  gap: 4px;
  color: rgba(29, 31, 42, 0.7);
}

.nf-path__label {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.72rem;
}

.nf-path__value {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  color: rgba(29, 31, 42, 0.85);
  word-break: break-all;
}

.nf-figure {
  position: relative;
  min-height: 260px;
  display: grid;
  place-items: center;
  animation: float 8s ease-in-out infinite;
}

.nf-planet {
  width: min(260px, 70vw);
  height: min(260px, 70vw);
  border-radius: 999px;
  background: radial-gradient(circle at 30% 30%, #ffffff 0%, #f1e1cb 45%, #e5c6a1 100%);
  position: relative;
  box-shadow: inset -20px -30px 60px rgba(29, 31, 42, 0.12);
}

.nf-ring {
  position: absolute;
  inset: 50% auto auto 50%;
  width: 130%;
  height: 40%;
  border-radius: 999px;
  border: 3px solid rgba(29, 31, 42, 0.2);
  transform: translate(-50%, -50%) rotate(-12deg);
  box-shadow: 0 10px 40px rgba(29, 31, 42, 0.15);
}

.nf-ring--thin {
  width: 115%;
  height: 34%;
  border-width: 2px;
  border-color: rgba(123, 185, 158, 0.7);
}

.nf-ghost {
  position: absolute;
  font-size: clamp(5rem, 10vw, 9rem);
  font-weight: 700;
  color: rgba(29, 31, 42, 0.08);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-12px);
  }
}

@media (min-width: 900px) {
  .nf-shell {
    grid-template-columns: 1.1fr 0.9fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nf-orb,
  .nf-card,
  .nf-figure {
    animation: none;
  }
}
</style>
