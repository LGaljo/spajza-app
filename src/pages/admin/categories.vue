<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { toast } from 'vue3-toastify'
import { useCategoriesStore } from '~/stores/categories.store'

definePageMeta({
  layout: 'default',
})

const categoriesStore = useCategoriesStore()
const runtimeConfig = useRuntimeConfig()
const apiFetch = useApiFetch()

const category = ref('')
const editId = ref<string | null>(null)

const load = async () => {
  await categoriesStore.fetch(null)
}

const resetEdit = () => {
  category.value = ''
  editId.value = null
}

const updateEdit = (entry: any) => {
  category.value = entry?.name ?? ''
  editId.value = entry?._id ?? null
}

const removeCategory = async (entry: any) => {
  await categoriesStore.remove(entry?._id)
  await load()
}

const addUpdate = async () => {
  if (!category.value) {
    toast.error('Polje ne sme biti prazno', { autoClose: 3000 })
    return
  }
  try {
    if (editId.value) {
      await apiFetch(`${runtimeConfig.public.apiUrl}/categories/${editId.value}`, {
        method: 'POST',
        body: { name: category.value },
      })
      toast.success(`Obdobje "${category.value}" uspešno posodobljeno`, { autoClose: 3000 })
    } else {
      await apiFetch(`${runtimeConfig.public.apiUrl}/categories`, {
        method: 'POST',
        body: { name: category.value },
      })
      toast.success(`Obdobje "${category.value}" uspešno dodano`, { autoClose: 3000 })
    }
    resetEdit()
    await load()
  } catch (err) {
    console.error(err)
    toast.error('Napaka pri shranjevanju kategorije', { autoClose: 3000 })
  }
}

watch(category, (value) => {
  if (!value) {
    editId.value = null
  }
})

onMounted(load)
</script>

<template>
  <section class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-semibold mb-6">Kategorije</h1>

    <div class="mb-6">
      <span class="block font-semibold">
        {{ editId ? 'Uredi' : 'Dodaj' }}
        <span v-if="editId" class="text-sm text-base-content/70">(Počisti polje za dodajanje nove kategorije)</span>
      </span>
      <div class="join mt-3 w-full">
        <input
          v-model="category"
          type="text"
          class="input input-bordered join-item w-full"
          placeholder="Dodaj kategorijo"
          @keydown.enter.prevent="addUpdate"
        />
        <button class="btn btn-primary join-item" @click="addUpdate">
          {{ editId ? 'Shrani' : 'Dodaj' }}
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="table table-zebra">
        <thead>
          <tr>
            <th>Ime</th>
            <th class="text-right">Dejanja</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in categoriesStore.getList" :key="entry._id">
            <td>{{ entry.name }}</td>
            <td class="text-right space-x-3">
              <button class="btn btn-link text-error px-0" @click="removeCategory(entry)">Izbriši</button>
              <button class="btn btn-link text-info px-0" @click="updateEdit(entry)">Uredi</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!categoriesStore.getList?.length" class="text-center py-6">Ni kategorij</div>
      <p class="text-sm text-base-content/70 mt-3">Brisana kategorija ne sme vsebovati predmetov.</p>
    </div>
  </section>
</template>
