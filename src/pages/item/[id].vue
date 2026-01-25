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
  <section class="max-w-4xl mx-auto px-4 py-8">
    <div class="card bg-base-100 shadow">
      <div class="card-body">
        <div v-if="item" class="flex flex-wrap gap-2 mb-4">
          <button v-if="!item.rents" class="btn btn-primary" @click="openRentDialog">Izposodi</button>
          <button
            v-if="hasTemplateImage"
            class="btn btn-warning"
            :disabled="!(isAdmin || isKeeper)"
            @click="router.push(`/edit/defects/${item._id}`)"
          >
            Pomanjkljivosti
          </button>
          <div class="ml-auto" v-if="isAdmin || isKeeper">
            <div class="dropdown dropdown-end">
              <label tabindex="0" class="btn">Dejanja</label>
              <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40">
                <li><a @click="router.push(`/edit/${itemId}`)">Uredi</a></li>
                <li><a @click="deleteDialogRef?.open()">Izbriši</a></li>
              </ul>
            </div>
          </div>
        </div>

        <span v-if="item?.category" class="badge badge-primary mb-2">{{ item.category.name }}</span>
        <h1 class="text-3xl font-semibold">{{ item?.name }}</h1>

        <div class="flex flex-wrap gap-2 mt-2">
          <span v-if="item?.status" class="badge" :class="statusMeta[item.status]?.class">
            {{ statusMeta[item.status]?.text ?? item.status }}
          </span>
          <span v-if="item?.extras?.defects?.length" class="badge badge-error">šotor z defekti</span>
        </div>

        <div class="mt-4" v-if="item">
          <div v-if="item.cover?.length">
            <img :src="coverSrc" alt="cover image" class="rounded w-full" />
            <div v-if="item.cover.length > 1" class="flex gap-2 mt-2 flex-wrap">
              <img
                v-for="im in item.cover"
                :key="im.key"
                :src="im.Location"
                alt="Image"
                class="w-24 h-20 object-cover rounded cursor-pointer"
                @click="coverSrc = im.Location"
              />
            </div>
          </div>
          <div v-else class="p-4 bg-base-200 rounded">Ni slike</div>
        </div>

        <div v-if="item?.description" class="mt-4">
          <p>{{ item.description }}</p>
        </div>

        <div v-if="item?.tags?.length" class="mt-4">
          <b>Značke:</b>
          <span v-for="tag in item.tags" :key="tag._id" class="badge badge-secondary ml-2">{{ tag.name }}</span>
        </div>

        <div class="mt-4 space-y-1">
          <div v-if="item?.boughtTime"><b>Čas pridobitve:</b> {{ formatDateTime(item.boughtTime) }}</div>
          <div v-if="item?.count"><b>Količina:</b> {{ item.count }}</div>
          <div v-if="item?.location"><b>Lokacija:</b> {{ item.location }}</div>
          <div v-if="item?.owner"><b>Lastnik:</b> {{ item.owner }}</div>
        </div>
      </div>
    </div>

    <div v-if="item?.rents?.renter" class="card bg-base-100 shadow mt-4">
      <div class="card-body">
        <h2 class="card-title">Izposoja</h2>
        <div>
          <div v-if="!item.rents.subject">
            Predmet si je izposodil <b>{{ item.rents.renter.username }}</b> dne
            <b>{{ formatDate(item.rents.borrowedAt) }}</b>.
          </div>
          <div v-else>
            Predmet je <b>{{ item.rents.renter.username }}</b> posodil <b>{{ item.rents.subject }}</b> dne
            <b>{{ formatDate(item.rents.borrowedAt) }}</b>.
          </div>
          <div>Obljubil je, da ga vrne <b>{{ formatDate(item.rents.returnTime) }}</b>.</div>
        </div>
        <button
          v-if="user && (user._id === item.rents.renter || isAdmin || isKeeper)"
          class="btn btn-primary mt-4"
          @click="returnItem"
        >
          Vrni
        </button>
      </div>
    </div>

    <ChangesList v-if="item && changes" :changes="changes" />

    <RentDialog ref="rentDialogRef" />
    <ModalDialog ref="deleteDialogRef" title="Izbriši" action="Izbriši" @first="deleteItem">
      <template #body>Želiš zbrisati <b>{{ item?.name }}</b>?</template>
    </ModalDialog>
  </section>
</template>
