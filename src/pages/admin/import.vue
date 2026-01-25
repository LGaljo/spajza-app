<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import readXlsxFile from 'read-excel-file'

definePageMeta({
  layout: 'default',
})

type ImportItem = {
  name: string
  categoryName: string
  count: number | null
  description?: string | null
  location?: string | null
  owner?: string | null
  tagNames?: string[] | null
}

const runtimeConfig = useRuntimeConfig()
const apiFetch = useApiFetch()
const file = ref<File | null>(null)
const loading = ref(false)
const validationFail = ref(0)
const items = ref<ImportItem[]>([])

const parseItems = async () => {
  if (!file.value) return
  validationFail.value = 0
  items.value = []
  loading.value = true

  try {
    const rows = await readXlsxFile(file.value)
    rows.shift()

    for (const row of rows) {
      if (row[0] && row[1]) {
        const item: ImportItem = {
          name: String(row[0]),
          categoryName: String(row[1]),
          count: row[2] ? Number(row[2]) : null,
          description: row[3] ? String(row[3]) : null,
          location: row[4] ? String(row[4]) : null,
          owner: row[5] ? String(row[5]) : null,
          tagNames: row[6] ? String(row[6]).split(',') : null,
        }
        items.value.push(item)
      } else {
        validationFail.value += 1
      }
    }

    if (validationFail.value === 0) {
      toast.success('Predmeti uspešno dodani', { autoClose: 3000 })
    } else {
      toast.success(`Predmeti uspešno dodani, neustreznih: ${validationFail.value}`, { autoClose: 6000 })
    }
  } catch (err) {
    console.error(err)
    toast.error('Prišlo je do napake pri uvažanju', { autoClose: 3000 })
  } finally {
    file.value = null
    loading.value = false
  }
}

const importItems = async () => {
  if (!items.value.length || validationFail.value !== 0) return
  loading.value = true
  try {
    await apiFetch(`/inventory/multi`, {
      method: 'POST',
      body: items.value,
    })
    toast.success('Predmeti uvoženi', { autoClose: 3000 })
  } catch (err) {
    console.error(err)
    toast.error('Napaka pri uvozu', { autoClose: 3000 })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="max-w-6xl mx-auto px-4 py-8">
    <h2 class="text-2xl font-semibold mb-4">Uvozi predmete iz datoteke</h2>

    <input
      type="file"
      accept=".xlsx"
      class="file-input file-input-bordered w-full max-w-lg"
      @change="file = ($event.target as HTMLInputElement).files?.[0] ?? null"
    />

    <div class="mt-3 flex flex-wrap gap-2">
      <button class="btn btn-secondary" :disabled="!file || loading" @click="parseItems">
        <span v-if="loading" class="loading loading-spinner loading-sm"></span>
        Preberi
      </button>
      <button class="btn btn-secondary" :disabled="!items.length || validationFail !== 0 || loading" @click="importItems">
        <span v-if="loading" class="loading loading-spinner loading-sm"></span>
        {{ loading ? 'Uvažam...' : 'Uvozi' }}
      </button>
    </div>

    <div class="mt-4">
      <b>Napak pri branju: {{ validationFail }}. Pred uvozom popravi napake.</b>
    </div>

    <div class="overflow-x-auto mt-4" v-if="items.length">
      <table class="table table-zebra">
        <thead>
          <tr>
            <th>Ime</th>
            <th>Kategorija</th>
            <th>Št.</th>
            <th>Opis</th>
            <th>Lokacija</th>
            <th>Lastnik</th>
            <th>Značke</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in items" :key="idx">
            <td>{{ item.name }}</td>
            <td>{{ item.categoryName }}</td>
            <td>{{ item.count }}</td>
            <td>{{ item.description }}</td>
            <td>{{ item.location }}</td>
            <td>{{ item.owner }}</td>
            <td>{{ item.tagNames?.join(', ') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
