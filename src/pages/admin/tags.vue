<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { toast } from 'vue3-toastify'
import { useTagsStore } from '~/stores/tags.store'
import {
  TagIcon,
  PencilSquareIcon,
  XMarkIcon,
  InformationCircleIcon,
  PlusIcon,
  CheckIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/solid'

definePageMeta({
  layout: 'default',
})

const tagsStore = useTagsStore()
const runtimeConfig = useRuntimeConfig()
const apiFetch = useApiFetch()

const tag = ref('')
const editId = ref<string | null>(null)

const load = async () => {
  await tagsStore.fetch(null)
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
  if (confirm(`Ali ste prepričani, da želite izbrisati značko "${entry?.name}"?`)) {
    await tagsStore.remove(entry?._id)
    await load()
  }
}

const addUpdate = async () => {
  if (!tag.value) {
    toast.error('Polje ne sme biti prazno', { autoClose: 3000 })
    return
  }
  try {
    if (editId.value) {
      await apiFetch(`${runtimeConfig.public.apiUrl}/tags/${editId.value}`, {
        method: 'POST',
        body: { name: tag.value },
      })
      toast.success(`Značka "${tag.value}" uspešno posodobljena`, { autoClose: 3000 })
    } else {
      await apiFetch(`${runtimeConfig.public.apiUrl}/tags`, {
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
  <section class="max-w-6xl mx-auto px-4 py-8">
    <!-- Header with Breadcrumbs or modern title -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-base-content">
          Upravljanje značk
        </h1>
        <p class="text-sm text-base-content/60 mt-1">
          Ustvarite in urejajte značke za lažje filtriranje in razvrščanje predmetov.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left side: Form (Form Card) -->
      <div class="lg:col-span-4">
        <div class="card bg-base-100 shadow-md border border-base-200/60 overflow-hidden">
          <div class="card-body p-6">
            <div class="flex items-center gap-2 mb-4">
              <span class="p-2 bg-primary/10 text-primary rounded-lg">
                <TagIcon class="w-5 h-5" v-if="!editId" />
                <PencilSquareIcon class="w-5 h-5" v-else />
              </span>
              <h2 class="card-title text-lg font-bold">
                {{ editId ? 'Uredi značko' : 'Nova značka' }}
              </h2>
            </div>

            <div class="form-control w-full gap-4">
              <div>
                <label class="label pt-0">
                  <span class="label-text font-semibold text-base-content/80">Naziv značke</span>
                </label>
                <div class="relative">
                  <input
                    v-model="tag"
                    type="text"
                    class="input input-bordered w-full pl-3 pr-10 focus:input-primary transition-all duration-200"
                    placeholder="Npr. občutljivo, nujno..."
                    @keydown.enter.prevent="addUpdate"
                  />
                  <span v-if="tag" class="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button type="button" @click="resetEdit" class="text-base-content/30 hover:text-base-content/60 focus:outline-none">
                      <XMarkIcon class="w-5 h-5" />
                    </button>
                  </span>
                </div>
                <label class="label pb-0" v-if="editId">
                  <span class="label-text-alt text-base-content/60 flex items-center gap-1 leading-normal">
                    <InformationCircleIcon class="w-4 h-4 text-info flex-shrink-0" />
                    Počisti polje za dodajanje nove značke
                  </span>
                </label>
              </div>

              <div class="flex flex-col sm:flex-row gap-2 mt-2">
                <button class="btn btn-primary flex-1 shadow-sm font-bold gap-1.5" @click="addUpdate">
                  <PlusIcon v-if="!editId" class="w-4 h-4" />
                  <CheckIcon v-else class="w-4 h-4" />
                  {{ editId ? 'Shrani' : 'Dodaj' }}
                </button>
                <button v-if="editId" class="btn btn-ghost border border-base-300 font-bold" @click="resetEdit">
                  Prekliči
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right side: Table/List -->
      <div class="lg:col-span-8 space-y-4">
        <div class="card bg-base-100 shadow-md border border-base-200/60 overflow-hidden">
          <div class="p-6 pb-0">
            <h2 class="text-lg font-extrabold text-base-content flex items-center gap-2">
              Seznam značk
              <span class="badge badge-secondary badge-sm font-bold">{{ tagsStore.get?.length || 0 }}</span>
            </h2>
          </div>
          
          <div class="p-6">
            <div class="overflow-x-auto rounded-lg border border-base-200">
              <table class="table w-full">
                <thead>
                  <tr class="bg-base-200/50">
                    <th class="font-bold text-xs uppercase tracking-wider text-base-content/60 pl-4">Ime značke</th>
                    <th class="font-bold text-xs uppercase tracking-wider text-base-content/60 text-right pr-6">Dejanja</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-base-200">
                  <tr v-for="entry in tagsStore.get" :key="entry._id" class="hover:bg-base-200/20 transition-all duration-150">
                    <td class="font-medium text-base-content pl-4">
                      <div class="flex items-center gap-3">
                        <span class="p-1.5 bg-base-200 text-base-content/60 rounded-md">
                          <TagIcon class="w-4 h-4" />
                        </span>
                        <span>{{ entry.name }}</span>
                      </div>
                    </td>
                    <td class="text-right pr-6 py-2">
                      <div class="inline-flex gap-1.5">
                        <button 
                          class="btn btn-sm btn-ghost hover:bg-info/10 hover:text-info text-base-content/70 gap-1"
                          @click="updateEdit(entry)"
                        >
                          <PencilSquareIcon class="w-4 h-4" />
                          <span class="hidden sm:inline">Uredi</span>
                        </button>
                        <button 
                          class="btn btn-sm btn-ghost hover:bg-error/10 hover:text-error text-base-content/70 gap-1"
                          @click="removeTag(entry)"
                        >
                          <TrashIcon class="w-4 h-4" />
                          <span class="hidden sm:inline">Izbriši</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                  
                  <tr v-if="!tagsStore.get?.length">
                    <td colspan="2" class="text-center py-12 text-base-content/50">
                      <TagIcon class="w-12 h-12 mx-auto mb-2 text-base-content/20" />
                      <p class="font-semibold text-sm">Ni najdenih značk</p>
                      <p class="text-xs text-base-content/40 mt-1">Ustvarite svojo prvo značko z obrazcem na levi.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="flex items-start gap-2.5 bg-warning/5 border border-warning/10 p-4 rounded-xl mt-6">
              <ExclamationTriangleIcon class="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h4 class="text-xs font-extrabold text-warning uppercase tracking-wider">Pomembno opozorilo</h4>
                <p class="text-xs text-base-content/75 mt-0.5 leading-relaxed">
                  Brisana značka ne sme vsebovati aktivnih ali upokojenih predmetov v inventarju. Pred brisanjem se prepričajte, da so vsi predmeti brez te značke.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
