<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from '#vue-router'
import { useAuthStore } from '~/stores/auth.store'
import { useItemStore } from '~/stores/item.store'
import { useTracingStore } from '~/stores/tracing.store'
import { useCategoriesStore } from '~/stores/categories.store'
import ModalDialog from '~/components/modals/ModalDialog.vue'
import RentDialog from '~/components/modals/RentDialog.vue'
import ChangesList from '~/components/ChangesList.vue'
import {
  CalendarDaysIcon,
  CircleStackIcon,
  MapPinIcon,
  UserIcon,
  TagIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
  PencilSquareIcon,
  TrashIcon,
  PhotoIcon,
  EllipsisVerticalIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/solid'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const itemStore = useItemStore()
const tracingStore = useTracingStore()
const categoriesStore = useCategoriesStore()

const coverSrc = ref<string | null>(null)
const showLightbox = ref(false)
const deleteDialogRef = ref<InstanceType<typeof ModalDialog> | null>(null)
const rentDialogRef = ref<InstanceType<typeof RentDialog> | null>(null)

const itemId = computed(() => {
  const value = route.params.id
  return Array.isArray(value) ? value[0] : (value as string)
})

const item = computed(() => itemStore.item as any)
const changes = computed(() => tracingStore.get as any[])
const user = computed(() => authStore.user as any)
const isAdmin = computed(() => authStore.isAdmin)
const isKeeper = computed(() => authStore.isKeeper)

const hasTemplateImage = computed(() => !!categoriesStore.getOne?.templateImage)

const statusMeta: Record<string, { text: string; class: string }> = {
  NEW: { text: 'Novo', class: 'badge-info' },
  BORROWED: { text: 'Izposojeno', class: 'badge-warning' },
  STORED: { text: 'Na voljo', class: 'badge-success' },
  WRITTEN_OFF: { text: 'Odpisano', class: 'badge-secondary' },
}

const formatDate = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
}

const formatDateTime = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

const load = async () => {
  await itemStore.fetch(itemId.value)
  if (item.value?.cover?.length) {
    coverSrc.value = item.value.cover[0].Location
  }
  if (item.value?.category?._id) {
    await categoriesStore.fetchOne(item.value.category._id)
  }
  await tracingStore.fetch(itemId.value)
}

const deleteItem = async () => {
  await itemStore.remove(itemId.value)
  await router.replace('/')
}

const returnItem = async () => {
  await itemStore.returnItem(itemId.value)
  await load()
}

const openRentDialog = () => {
  rentDialogRef.value?.open(item.value)
}

onMounted(load)
</script>

<template>
  <section class="max-w-6xl mx-auto px-4 py-8">
    <div v-if="item" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Left Column: Image / Gallery -->
      <div class="lg:col-span-5 space-y-4">
        <div class="card bg-base-100 shadow-md border border-base-200/60 overflow-hidden">
          <div class="p-4 bg-base-100">
            <div v-if="item.cover?.length" class="relative group cursor-zoom-in" @click="showLightbox = true">
              <img 
                :src="coverSrc" 
                alt="cover image" 
                class="rounded-lg w-full h-auto aspect-square object-cover hover:scale-[1.01] transition-all duration-300 shadow-sm"
              />
              <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                <span class="bg-base-100/90 text-base-content text-sm font-semibold px-4 py-2 rounded-full shadow-md flex items-center gap-1.5 transition-all transform translate-y-1 group-hover:translate-y-0">
                  Povečaj sliko
                </span>
              </div>
            </div>
            <div v-else class="flex flex-col items-center justify-center py-24 bg-base-200/40 rounded-lg border-2 border-dashed border-base-300">
              <PhotoIcon class="w-12 h-12 text-base-content/25 mb-2" />
              <span class="text-sm font-semibold text-base-content/40">Ni slike</span>
            </div>
            
            <!-- Thumbnails -->
            <div v-if="item.cover?.length > 1" class="flex gap-2 mt-4 overflow-x-auto p-1 pb-2 scrollbar-thin">
              <img
                v-for="im in item.cover"
                :key="im.key"
                :src="im.Location"
                alt="Thumbnail"
                class="w-20 h-20 object-cover rounded-md cursor-pointer border-2 transition-all duration-200"
                :class="coverSrc === im.Location ? 'border-primary scale-105 shadow-sm' : 'border-transparent hover:border-base-300'"
                @click="coverSrc = im.Location"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right Column: Info & Details -->
      <div class="lg:col-span-7 space-y-6">
        
        <!-- Primary Info Card -->
        <div class="card bg-base-100 shadow-md border border-base-200/60">
          <div class="card-body gap-5 p-6 sm:p-8">
            <!-- Top Row: Category and Quick Actions -->
            <div class="flex items-center justify-between gap-4">
              <span v-if="item.category" class="badge badge-primary badge-outline font-semibold px-3 py-2.5 text-xs tracking-wide uppercase">
                {{ item.category.name }}
              </span>
              
              <!-- Quick Actions Dropdown (Edit/Delete) for keeper/admin -->
              <div v-if="isAdmin || isKeeper" class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-sm btn-ghost btn-circle">
                  <EllipsisVerticalIcon class="w-5 h-5 text-base-content/70" />
                </label>
                <ul tabindex="0" class="dropdown-content menu p-2 shadow-xl bg-base-100 border border-base-200 rounded-box w-40 z-20">
                  <li>
                    <a @click="router.push(`/edit/${itemId}`)" class="flex items-center gap-2 py-2">
                      <PencilSquareIcon class="w-4 h-4 text-info" />
                      <span>Uredi</span>
                    </a>
                  </li>
                  <li>
                    <a @click="deleteDialogRef?.open()" class="flex items-center gap-2 py-2 text-error hover:bg-error/10">
                      <TrashIcon class="w-4 h-4" />
                      <span>Izbriši</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <!-- Item Title & Statuses -->
            <div>
              <h1 class="text-3xl font-extrabold text-base-content tracking-tight leading-tight">{{ item.name }}</h1>
              
              <div class="flex flex-wrap items-center gap-2 mt-3.5">
                <span v-if="item.status" class="badge badge-lg font-bold px-3.5 py-3 text-xs tracking-wide uppercase" :class="statusMeta[item.status]?.class">
                  {{ statusMeta[item.status]?.text ?? item.status }}
                </span>
                <span v-if="item.extras?.defects?.length" class="badge badge-error badge-lg text-white font-bold gap-1 px-3.5 py-3 text-xs tracking-wide uppercase">
                  <ExclamationTriangleIcon class="w-3.5 h-3.5" />
                  šotor z defekti
                </span>
              </div>
            </div>
            
            <!-- Description -->
            <div v-if="item.description" class="text-base-content/80 text-sm leading-relaxed whitespace-pre-line border-t border-base-200/60 pt-5">
              <h2 class="text-xs font-bold text-base-content/40 uppercase tracking-widest mb-2">Opis</h2>
              <p>{{ item.description }}</p>
            </div>
            
            <!-- Tags -->
            <div v-if="item.tags?.length" class="border-t border-base-200/60 pt-5">
              <h2 class="text-xs font-bold text-base-content/40 uppercase tracking-widest mb-2.5">Značke</h2>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="tag in item.tags" :key="tag._id" class="badge badge-secondary badge-outline px-3 py-2 text-xs font-semibold">
                  {{ tag.name }}
                </span>
              </div>
            </div>
            
            <!-- Specs Grid -->
            <div class="border-t border-base-200/60 pt-5">
              <h2 class="text-xs font-bold text-base-content/40 uppercase tracking-widest mb-3.5">Podrobnosti</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <!-- Količina -->
                <div v-if="item.count !== undefined && item.count !== null" class="flex items-center gap-3 bg-base-200/30 p-3.5 rounded-xl border border-base-200/40">
                  <div class="bg-primary/10 text-primary p-2.5 rounded-lg">
                    <CircleStackIcon class="w-5 h-5" />
                  </div>
                  <div>
                    <div class="text-[10px] text-base-content/50 uppercase tracking-widest font-bold">Količina</div>
                    <div class="text-sm font-extrabold text-base-content">{{ item.count }}</div>
                  </div>
                </div>
                
                <!-- Lokacija -->
                <div v-if="item.location" class="flex items-center gap-3 bg-base-200/30 p-3.5 rounded-xl border border-base-200/40">
                  <div class="bg-primary/10 text-primary p-2.5 rounded-lg">
                    <MapPinIcon class="w-5 h-5" />
                  </div>
                  <div>
                    <div class="text-[10px] text-base-content/50 uppercase tracking-widest font-bold">Lokacija</div>
                    <div class="text-sm font-extrabold text-base-content">{{ item.location }}</div>
                  </div>
                </div>

                <!-- Lastnik -->
                <div v-if="item.owner" class="flex items-center gap-3 bg-base-200/30 p-3.5 rounded-xl border border-base-200/40">
                  <div class="bg-primary/10 text-primary p-2.5 rounded-lg">
                    <UserIcon class="w-5 h-5" />
                  </div>
                  <div>
                    <div class="text-[10px] text-base-content/50 uppercase tracking-widest font-bold">Lastnik</div>
                    <div class="text-sm font-extrabold text-base-content">{{ item.owner }}</div>
                  </div>
                </div>

                <!-- Čas pridobitve -->
                <div v-if="item.boughtTime" class="flex items-center gap-3 bg-base-200/30 p-3.5 rounded-xl border border-base-200/40">
                  <div class="bg-primary/10 text-primary p-2.5 rounded-lg">
                    <CalendarDaysIcon class="w-5 h-5" />
                  </div>
                  <div>
                    <div class="text-[10px] text-base-content/50 uppercase tracking-widest font-bold">Čas pridobitve</div>
                    <div class="text-sm font-extrabold text-base-content">{{ formatDateTime(item.boughtTime) }}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Actions Footer inside Right Card -->
            <div v-if="!item.rents || hasTemplateImage" class="card-actions flex flex-col sm:flex-row gap-3 mt-4 pt-5 border-t border-base-200/60">
              <button 
                v-if="!item.rents" 
                class="btn btn-primary flex-1 shadow-sm font-bold text-sm tracking-wide" 
                @click="openRentDialog"
              >
                Izposodi
              </button>
              <button
                v-if="hasTemplateImage"
                class="btn btn-warning flex-1 gap-2 shadow-sm font-bold text-sm tracking-wide"
                :disabled="!(isAdmin || isKeeper)"
                @click="router.push(`/edit/defects/${item._id}`)"
              >
                <WrenchScrewdriverIcon class="w-4 h-4" />
                Pomanjkljivosti
              </button>
            </div>
          </div>
        </div>
        
        <!-- Borrow details Card if Rented -->
        <div v-if="item.rents?.renter" class="card bg-warning/5 border border-warning/20 shadow-md">
          <div class="card-body gap-2.5 p-6">
            <div class="flex items-center gap-2 text-warning font-extrabold mb-1">
              <InformationCircleIcon class="w-5 h-5" />
              <h2 class="text-lg font-bold">Informacije o izposoji</h2>
            </div>
            <div class="text-sm text-base-content/85 leading-relaxed">
              <div v-if="!item.rents.subject" class="mb-1">
                Predmet si je izposodil uporabnik <span class="font-bold text-base-content">{{ item.rents.renter.username }}</span> dne
                <span class="font-bold text-base-content">{{ formatDate(item.rents.borrowedAt) }}</span>.
              </div>
              <div v-else class="mb-1">
                Predmet je uporabnik <span class="font-bold text-base-content">{{ item.rents.renter.username }}</span> posodil osebi/projektu <span class="font-bold text-base-content">{{ item.rents.subject }}</span> dne
                <span class="font-bold text-base-content">{{ formatDate(item.rents.borrowedAt) }}</span>.
              </div>
              <div>
                Obljubljen rok vračila je <span class="font-bold text-base-content underline decoration-warning decoration-2">{{ formatDate(item.rents.returnTime) }}</span>.
              </div>
            </div>
            <button
              v-if="user && (user._id === (item.rents.renter?._id ?? item.rents.renter) || isAdmin || isKeeper)"
              class="btn btn-warning mt-3 w-full sm:w-auto self-start shadow-sm font-extrabold"
              @click="returnItem"
            >
              Vrni predmet
            </button>
          </div>
        </div>
        
      </div>
      
    </div>
    
    <!-- Changes History Section (Full Width) -->
    <div v-if="item && changes" class="mt-12">
      <div class="divider font-semibold text-base-content/50 text-sm mb-6 uppercase tracking-wider">Zgodovina sprememb</div>
      <ChangesList :changes="changes" />
    </div>

    <RentDialog ref="rentDialogRef" />
    <ModalDialog ref="deleteDialogRef" title="Izbriši" action="Izbriši" @first="deleteItem">
      <template #body>Želiš zbrisati <b>{{ item?.name }}</b>?</template>
    </ModalDialog>

    <!-- Lightbox Modal -->
    <dialog v-if="showLightbox" class="modal modal-open bg-black/80 flex items-center justify-center z-50" @close="showLightbox = false">
      <div class="relative max-w-5xl max-h-[90vh] flex flex-col items-center">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-white hover:bg-white/20 z-10 text-xl" @click="showLightbox = false">✕</button>
        <img :src="coverSrc" class="max-w-full max-h-[80vh] object-contain rounded-lg" alt="zoomed image" />
        <div class="text-white mt-4 text-center select-none bg-black/50 px-4 py-2 rounded-full text-sm">
          {{ item?.name }}
        </div>
      </div>
      <form method="dialog" class="modal-backdrop absolute inset-0">
        <button class="w-full h-full cursor-default" @click="showLightbox = false">close</button>
      </form>
    </dialog>
  </section>
</template>
