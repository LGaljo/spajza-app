<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import ModalDialog from '~/components/modals/ModalDialog.vue'
import { useCategoriesStore } from '~/stores/categories.store'

definePageMeta({
  layout: 'default',
})

const categoriesStore = useCategoriesStore()
const runtimeConfig = useRuntimeConfig()
const apiFetch = useApiFetch()

const selectedCategory = ref<string | null>(null)
const templateImage = ref<File | null>(null)
const dialogRef = ref<InstanceType<typeof ModalDialog> | null>(null)

const filterCategories = computed(() =>
  (categoriesStore.getList ?? []).filter((category: any) => !!category.templateImage),
)

const load = async () => {
  await categoriesStore.fetch(null)
}

const openAddTemplate = () => {
  selectedCategory.value = null
  templateImage.value = null
  dialogRef.value?.open()
}

const addTemplate = async () => {
  if (!selectedCategory.value) {
    toast.error('Polje ne sme biti prazno', { autoClose: 3000 })
    return
  }
  if (!templateImage.value) {
    toast.error('Izberi sliko', { autoClose: 3000 })
    return
  }

  try {
    const formData = new FormData()
    formData.append('file', templateImage.value)
    await apiFetch(`/categories/file/${selectedCategory.value}`, {
      method: 'POST',
      body: formData,
    })
    toast.success('Predloga uspešno dodana', { autoClose: 3000 })
  } catch (err) {
    console.error(err)
    toast.error('Napaka pri dodajanju predloge', { autoClose: 3000 })
  } finally {
    await load()
  }
}

const removeTemplate = async (category: any) => {
  try {
    await apiFetch(`/categories/remove_file/${category._id}`, { method: 'POST' })
    toast.success('Predloga uspešno izbrisana', { autoClose: 3000 })
  } catch (err) {
    console.error(err)
    toast.error('Napaka pri dodajanju predloge', { autoClose: 3000 })
  } finally {
    await load()
  }
}

onMounted(load)
</script>

<template>
  <section class="max-w-6xl mx-auto px-4 py-8">
    <div class="text-center mb-6">
      <h1 class="text-3xl font-semibold">Predloge slik</h1>
      <p class="mt-2 text-base-content/70">
        Predloge so namenjene za uporabo označevanja defektov na predmetih. Vsaka kategorija ima lahko eno sliko.
      </p>
    </div>

    <div class="mb-6">
      <button class="btn btn-primary" @click="openAddTemplate">Dodaj predlogo</button>
    </div>

    <div class="mt-2">
      <h3 class="text-xl font-semibold mb-4">Predloge po kategorijah</h3>
      <div v-if="filterCategories.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="category in filterCategories" :key="category._id" class="card bg-base-100 shadow">
          <figure>
            <img :src="category.templateImage.Location" alt="template" />
          </figure>
          <div class="card-body">
            <h4 class="card-title">{{ category.name }}</h4>
            <div class="card-actions">
              <button class="btn btn-primary" @click="removeTemplate(category)">Odstrani predlogo</button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-6">Ni dodanih predlog</div>
    </div>

    <ModalDialog
      ref="dialogRef"
      title="Dodaj predlogo"
      action="Dodaj"
      :disable-action="!selectedCategory || !templateImage"
      @first="addTemplate"
    >
      <template #body>
        <div>
          <span class="block font-semibold mb-2">Izberi kategorijo in dodaj sliko</span>
          <select v-model="selectedCategory" class="select select-bordered w-full mb-3">
            <option :value="null" disabled>-- Izberi kategorijo --</option>
            <option v-for="category in categoriesStore.getList" :key="category._id" :value="category._id">
              {{ category.name }}
            </option>
          </select>
          <input
            type="file"
            accept="image/*"
            class="file-input file-input-bordered w-full"
            @change="templateImage = ($event.target as HTMLInputElement).files?.[0] ?? null"
          />
        </div>
      </template>
    </ModalDialog>
  </section>
</template>
