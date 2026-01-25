<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from '#vue-router'
import { toast } from 'vue3-toastify'
import { useCategoriesStore } from '~/stores/categories.store'
import { useTagsStore } from '~/stores/tags.store'
import { useItemStore } from '~/stores/item.store'

type CoverEntry = {
  url: string
  file?: File
  existing?: { key?: string; Location?: string }
}

type InventoryForm = {
  name: string
  categoryId: string | null
  tags: string[]
  count: number
  description: string
  location: string
  boughtTime: string
  owner: string
  status: string
}

const route = useRoute()
const router = useRouter()
const categoriesStore = useCategoriesStore()
const tagsStore = useTagsStore()
const itemStore = useItemStore()
const runtimeConfig = useRuntimeConfig()
const apiFetch = useApiFetch()

const statuses = [
  { text: 'Novo', value: 'NEW' },
  { text: 'Izposojeno', value: 'BORROWED' },
  { text: 'Na voljo', value: 'STORED' },
  { text: 'Odpisano', value: 'WRITTEN_OFF' },
]

const formatDateTimeLocal = (date: Date) => {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}`
}

const form = reactive<InventoryForm>({
  name: '',
  categoryId: null,
  tags: [],
  count: 1,
  description: '',
  location: 'Plac',
  boughtTime: formatDateTimeLocal(new Date()),
  owner: 'RZS',
  status: 'NEW',
})

const loading = ref(false)
const coverEntries = ref<CoverEntry[]>([])
const imagesToRemove = ref<string[]>([])

const optionsCats = computed(() => categoriesStore.getOptions)
const optionsTags = computed(() => tagsStore.getOptions)

const existingId = computed(() => {
  const value = route.params.id
  return Array.isArray(value) ? value[0] : (value as string | undefined)
})

const onFilesSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files ?? [])
  for (const file of files) {
    coverEntries.value.push({ url: URL.createObjectURL(file), file })
  }
  target.value = ''
}

const moveUp = (idx: number) => {
  if (idx <= 0) return
  const temp = coverEntries.value[idx - 1]
  coverEntries.value[idx - 1] = coverEntries.value[idx]
  coverEntries.value[idx] = temp
}

const moveDown = (idx: number) => {
  if (idx >= coverEntries.value.length - 1) return
  const temp = coverEntries.value[idx + 1]
  coverEntries.value[idx + 1] = coverEntries.value[idx]
  coverEntries.value[idx] = temp
}

const removeImage = (entry: CoverEntry) => {
  if (entry.existing?.key) {
    imagesToRemove.value.push(entry.existing.key)
  }
  coverEntries.value = coverEntries.value.filter((item) => item.url !== entry.url)
}

const loadExisting = async (id: string) => {
  await itemStore.fetch(id)
  const item = itemStore.item as any
  if (!item) return
  form.name = item.name ?? ''
  form.categoryId = item?.category?._id ?? item.category ?? null
  form.tags = (item.tags ?? []).map((tag: any) => tag?._id ?? tag)
  form.count = item.count ?? 1
  form.description = item.description ?? ''
  form.location = item.location ?? ''
  form.boughtTime = item.boughtTime ? formatDateTimeLocal(new Date(item.boughtTime)) : form.boughtTime
  form.owner = item.owner ?? ''
  form.status = item.status ?? 'NEW'
  coverEntries.value = (item.cover ?? []).map((cover: any) => ({
    url: cover?.Location ?? '',
    existing: cover,
  }))
}

const createOrUpdate = async () => {
  if (!form.name || !form.categoryId || !form.count || !form.boughtTime) {
    toast.error('Napaka v vnosnih poljih', { autoClose: 2000 })
    return
  }

  loading.value = true
  try {
    if (existingId.value) {
      await apiFetch(`${runtimeConfig.public.apiUrl}/inventory/${existingId.value}`, {
        method: 'PUT',
        body: {
          ...form,
          category: form.categoryId,
          boughtTime: new Date(form.boughtTime),
          cover: coverEntries.value.filter((entry) => entry.existing).map((entry) => entry.existing),
        },
      })

      for (const entry of coverEntries.value) {
        if (entry.file) {
          await itemStore.addImage({ file: entry.file, id: existingId.value })
        }
      }
      for (const key of imagesToRemove.value) {
        await itemStore.removeImage({ key, id: existingId.value })
      }

      toast.success(`Predmet "${form.name}" uspešno posodobljen`, { autoClose: 2000 })
      await router.back()
    } else {
      const res: any = await apiFetch(`${runtimeConfig.public.apiUrl}/inventory`, {
        method: 'POST',
        body: {
          ...form,
          category: form.categoryId,
          boughtTime: new Date(form.boughtTime),
        },
      })
      for (const entry of coverEntries.value) {
        if (entry.file) {
          await itemStore.addImage({ file: entry.file, id: res?._id })
        }
      }
      toast.success(`Predmet "${res?.name ?? form.name}" uspešno dodan`, { autoClose: 2000 })
      if (res?._id) {
        await router.replace(`/item/${res._id}`)
      }
    }
  } catch (err) {
    console.error(err)
    toast.error('Napaka pri shranjevanju predmeta', { autoClose: 2000 })
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await categoriesStore.fetch(null)
  await tagsStore.fetch(null)
  if (existingId.value) {
    await loadExisting(existingId.value)
  }
})
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="createOrUpdate">
    <div class="form-control">
      <label class="label">
        <span class="label-text">Ime predmeta</span>
      </label>
      <input v-model="form.name" type="text" class="input input-bordered" placeholder="Vnesi ime" />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Slika</span>
      </label>
      <input type="file" multiple accept="image/*" class="file-input file-input-bordered w-full" @change="onFilesSelected" />
    </div>

    <div v-if="coverEntries.length" class="grid gap-4 md:grid-cols-2">
      <div v-for="(entry, idx) in coverEntries" :key="entry.url" class="card bg-base-200 shadow">
        <figure class="px-4 pt-4">
          <img :src="entry.url" alt="image" class="rounded" />
        </figure>
        <div class="card-body">
          <div class="card-actions justify-between">
            <button type="button" class="btn btn-sm" :disabled="idx === 0" @click="moveUp(idx)">Gor</button>
            <button type="button" class="btn btn-sm" :disabled="idx === coverEntries.length - 1" @click="moveDown(idx)">
              Dol
            </button>
            <button type="button" class="btn btn-sm btn-error" @click="removeImage(entry)">Odstrani</button>
          </div>
        </div>
      </div>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Kategorija</span>
      </label>
      <select v-model="form.categoryId" class="select select-bordered">
        <option :value="null" disabled>-- Izberi kategorijo --</option>
        <option v-for="option in optionsCats" :key="option.value" :value="option.value">{{ option.text }}</option>
      </select>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Značke</span>
      </label>
      <select v-model="form.tags" multiple class="select select-bordered">
        <option v-for="option in optionsTags" :key="option.value" :value="option.value">{{ option.text }}</option>
      </select>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Status</span>
      </label>
      <select v-model="form.status" class="select select-bordered">
        <option :value="null" disabled>-- Izberi stanje predmeta --</option>
        <option v-for="status in statuses" :key="status.value" :value="status.value">{{ status.text }}</option>
      </select>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Čas pridobitve</span>
      </label>
      <input v-model="form.boughtTime" type="datetime-local" class="input input-bordered" />
      <button type="button" class="btn btn-link px-0" @click="form.boughtTime = formatDateTimeLocal(new Date())">
        Nastavi danes
      </button>
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Število kosov</span>
      </label>
      <input v-model.number="form.count" type="number" min="1" class="input input-bordered" />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Lokacija</span>
      </label>
      <input v-model="form.location" type="text" class="input input-bordered" placeholder="Lokacija predmeta" />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Lastnik</span>
      </label>
      <input v-model="form.owner" type="text" class="input input-bordered" placeholder="Lastnik predmeta" />
    </div>

    <div class="form-control">
      <label class="label">
        <span class="label-text">Opis</span>
      </label>
      <textarea v-model="form.description" class="textarea textarea-bordered" rows="4" placeholder="Vnesi podrobnosti..." />
    </div>

    <button class="btn btn-primary" type="submit" :disabled="loading">
      {{ existingId ? 'Shrani' : 'Dodaj' }}
      <span v-if="loading" class="loading loading-spinner loading-sm"></span>
    </button>
  </form>
</template>
