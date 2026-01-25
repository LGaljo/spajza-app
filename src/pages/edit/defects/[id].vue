<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from '#vue-router'
import { toast } from 'vue3-toastify'
import { useItemStore } from '~/stores/item.store'
import { useCategoriesStore } from '~/stores/categories.store'
import ModalDialog from '~/components/modals/ModalDialog.vue'

definePageMeta({
  layout: 'default',
})

type DefectMarker = {
  top: number
  left: number
  text: string
  date: string
  key: string
}

const route = useRoute()
const itemStore = useItemStore()
const categoriesStore = useCategoriesStore()

const imageRef = ref<HTMLImageElement | null>(null)
const counter = ref(0)
const dialogRef = ref<InstanceType<typeof ModalDialog> | null>(null)
const nMarker = ref<DefectMarker>({
  top: 0,
  left: 0,
  text: '',
  date: new Date().toISOString(),
  key: '',
})

const resetMarker = () => {
  nMarker.value = {
    top: 0,
    left: 0,
    text: '',
    date: new Date().toISOString(),
    key: '',
  }
}

const relativeMarker = (marker: DefectMarker) => {
  const height = imageRef.value?.offsetHeight ?? 0
  const width = imageRef.value?.offsetWidth ?? 0
  return {
    top: marker.top * height,
    left: marker.left * width,
  }
}

const setFault = (event: MouseEvent) => {
  if (!imageRef.value) return
  const rect = imageRef.value.getBoundingClientRect()
  const offsetX = event.clientX - rect.left
  const offsetY = event.clientY - rect.top
  const width = imageRef.value.offsetWidth
  const height = imageRef.value.offsetHeight
  if (!width || !height) return

  nMarker.value = {
    top: (offsetY - 8) / height,
    left: (offsetX - 8) / width,
    text: '',
    date: new Date().toISOString(),
    key: crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  }

  dialogRef.value?.open()
  counter.value += 1
}

const saveMarker = async () => {
  if (!nMarker.value.text) {
    toast.error('Vnesi opis defekta', { autoClose: 2000 })
    return
  }
  await itemStore.addDefect({ ...nMarker.value })
  resetMarker()
}

const removeMarker = async (marker: DefectMarker) => {
  await itemStore.removeDefect(marker.key)
}

const formatDate = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

const load = async () => {
  const id = Array.isArray(route.params.id) ? route.params.id[0] : (route.params.id as string)
  await itemStore.fetch(id)
  const item = itemStore.item as any
  if (item?.category?._id) {
    await categoriesStore.fetchOne(item.category._id)
  }
}

const onResize = () => {
  counter.value += 1
}

onMounted(async () => {
  await load()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <section class="max-w-6xl mx-auto px-4 py-8">
    <div class="grid gap-6 lg:grid-cols-[1fr_260px]">
      <div class="relative">
        <div
          v-if="itemStore.item?.extras?.defects && categoriesStore.getOne?.templateImage?.Location"
          :key="counter"
        >
          <div
            v-for="marker in itemStore.item.extras.defects"
            :key="marker.key"
            class="marker"
            :style="{
              top: relativeMarker(marker).top + 'px',
              left: relativeMarker(marker).left + 'px',
            }"
            :title="marker.text"
          />
          <div
            v-if="nMarker.top && nMarker.left"
            class="marker-tmp"
            :style="{
              top: relativeMarker(nMarker).top + 'px',
              left: relativeMarker(nMarker).left + 'px',
            }"
          />
        </div>
        <img
          ref="imageRef"
          :src="categoriesStore.getOne?.templateImage?.Location"
          class="w-full h-auto"
          @click="setFault"
          @load="counter += 1"
        />
      </div>

      <div v-if="itemStore.item?.extras?.defects" class="space-y-3">
        <div
          v-for="marker in itemStore.item.extras.defects"
          :key="marker.key"
          class="bg-info text-info-content p-3 rounded"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="text-sm">
              <div class="font-semibold">{{ formatDate(marker.date) }}</div>
              <div>{{ marker.text }}</div>
            </div>
            <button class="btn btn-ghost btn-sm" @click="removeMarker(marker)">Odstrani</button>
          </div>
        </div>
      </div>
    </div>

    <ModalDialog ref="dialogRef" title="Opiši defekt" action="Shrani" @first="saveMarker" @close="resetMarker">
      <template #body>
        <input v-model="nMarker.text" type="text" class="input input-bordered w-full" placeholder="Besedilo" />
      </template>
    </ModalDialog>
  </section>
</template>

<style scoped>
.marker {
  position: absolute;
  width: 16px;
  height: 16px;
  background-color: red;
  border-radius: 50%;
}

.marker-tmp {
  position: absolute;
  width: 16px;
  height: 16px;
  background-color: greenyellow;
  border-radius: 50%;
}
</style>
