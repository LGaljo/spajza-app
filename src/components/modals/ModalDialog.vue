<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title: string
  action?: string
  secAction?: string
  disableAction?: boolean
  disableSecAction?: boolean
}>()

const emit = defineEmits<{
  (event: 'first'): void
  (event: 'second'): void
  (event: 'close'): void
}>()

const dialogRef = ref<HTMLDialogElement | null>(null)

const open = () => {
  dialogRef.value?.showModal()
}

const close = () => {
  dialogRef.value?.close()
  emit('close')
}

const onFirst = () => {
  emit('first')
  close()
}

const onSecond = () => {
  emit('second')
  close()
}

defineExpose({ open, close })
</script>

<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">{{ props.title }}</h3>
      <div class="mb-6">
        <slot name="body" />
      </div>
      <div class="modal-action">
        <button
          v-if="props.action"
          class="btn btn-primary"
          :disabled="props.disableAction"
          @click="onFirst"
        >
          {{ props.action }}
        </button>
        <button
          v-if="props.secAction"
          class="btn"
          :disabled="props.disableSecAction"
          @click="onSecond"
        >
          {{ props.secAction }}
        </button>
        <button class="btn btn-ghost" @click="close">Zapri</button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="close">close</button>
    </form>
  </dialog>
</template>
