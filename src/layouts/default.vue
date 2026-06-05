<template>
  <div class="min-h-screen bg-base-200">
    <AppHeader />
    <slot />
  </div>
</template>

<script setup lang="ts">
import AppHeader from "~/components/layout/AppHeader.vue";
</script>