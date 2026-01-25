<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { toast } from 'vue3-toastify'
import { useTagsStore } from '~/stores/tags.store'

definePageMeta({
  layout: 'default',
})

const tagsStore = useTagsStore()
const runtimeConfig = useRuntimeConfig()
const apiFetch = useApiFetch()

const tag = ref('')
const editId = ref<string | null>(null)

const load = async () => {
  await tagsStore.fetch()
}

const resetEdit = () => {
  tag.value = ''
  editId.value = null
}

const updateEdit = (entry: any) => {
  tag.value = entry?.name ?? ''
  editId.value = entry?._id ?? null
}

const removeTag = async (entry: any) => {
  await tagsStore.remove(entry?._id)
  await load()
}

const addUpdate = async () => {
  if (!tag.value) {
    toast.error('Polje ne sme biti prazno', { autoClose: 3000 })
    return
  }
  try {
    if (editId.value) {
      await apiFetch(`/tags/${editId.value}`, {
        method: 'POST',
        body: { name: tag.value },
      })
      toast.success(`Značka "${tag.value}" uspešno posodobljena`, { autoClose: 3000 })
    } else {
      await apiFetch(`/tags`, {
        method: 'POST',
        body: { name: tag.value },
      })
      toast.success(`Značka "${tag.value}" uspešno dodana`, { autoClose: 3000 })
    }
    resetEdit()
    await load()
  } catch (err) {
    console.error(err)
    toast.error('Napaka pri shranjevanju značke', { autoClose: 3000 })
  }
}

watch(tag, (value) => {
  if (!value) {
    editId.value = null
  }
})

onMounted(load)
</script>

<template>
  <section class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-semibold mb-6">Značke</h1>

    <div class="mb-6">
      <span class="block font-semibold">
        {{ editId ? 'Uredi' : 'Dodaj' }}
        <span v-if="editId" class="text-sm text-base-content/70">(Počisti polje za dodajanje nove značke)</span>
      </span>
      <div class="join mt-3 w-full">
        <input
          v-model="tag"
          type="text"
          class="input input-bordered join-item w-full"
          placeholder="Dodaj značko"
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
          <tr v-for="entry in tagsStore.get" :key="entry._id">
            <td>{{ entry.name }}</td>
            <td class="text-right space-x-3">
              <button class="btn btn-link text-error px-0" @click="removeTag(entry)">Izbriši</button>
              <button class="btn btn-link text-info px-0" @click="updateEdit(entry)">Uredi</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!tagsStore.get?.length" class="text-center py-6">Ni značk</div>
      <p class="text-sm text-base-content/70 mt-3">Brisana značka ne sme vsebovati predmetov.</p>
    </div>
  </section>
</template>
