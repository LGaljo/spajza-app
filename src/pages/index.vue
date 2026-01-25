<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from '#vue-router'
import { useItemsStore } from '~/stores/items.store'
import { useTagsStore } from '~/stores/tags.store'
import { useCategoriesStore } from '~/stores/categories.store'
import ItemCard from '~/components/ItemCard.vue'
import SidebarFilters from '~/components/SidebarFilters.vue'
import RentDialog from '~/components/modals/RentDialog.vue'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const router = useRouter()
const itemsStore = useItemsStore()
const tagsStore = useTagsStore()
const categoriesStore = useCategoriesStore()

const { limit, loading: loadingRef, get: itemsRef, currentSort, lastFetchCount } = storeToRefs(itemsStore)
const filtersOpen = useState<boolean>('filtersDialogOpen', () => false)
const filtersDialogRef = ref<HTMLDialogElement | null>(null)

const sort = computed(() => currentSort.value)
const items = computed(() => itemsRef.value)
const loading = computed(() => loadingRef.value)

const hasMore = ref(true)
const rentDialogRef = ref<InstanceType<typeof RentDialog> | null>(null)
const loadMoreTrigger = ref<HTMLDivElement | null>(null)
let loadMoreObserver: IntersectionObserver | null = null

const statuses = [
  { text: 'Novo', value: 'NEW' },
  { text: 'Izposojeno', value: 'BORROWED' },
  { text: 'Na voljo', value: 'STORED' },
  { text: 'Odpisano', value: 'WRITTEN_OFF' },
]

const applyFetchResult = (res: any[]) => {
  hasMore.value = !(!res?.length || res.length < limit.value)
}

const loadInitial = async () => {
  try {
    const tagsRes = await tagsStore.fetch()
    itemsStore.setFilterValues({ key: 'tags', values: tagsRes })
  } catch (err) {
    console.error(err)
  }

  try {
    const categoriesRes = await categoriesStore.fetch()
    itemsStore.setFilterValues({ key: 'category', values: categoriesRes })
  } catch (err) {
    console.error(err)
  }

  itemsStore.setFilterValues({ key: 'statuses', values: statuses })
  itemsStore.setFilters(route.query)
  itemsStore.reset()
  hasMore.value = true
  await loadMore()
}

const loadMore = async () => {
  if (!hasMore.value || loading.value) return
  const res: any[] = await itemsStore.fetch()
  applyFetchResult(res)
}

const onSortField = async (field: string) => {
  const res: any[] = await itemsStore.onSortUpdate({ field })
  applyFetchResult(res)
}

const onSortDir = async () => {
  const res: any[] = await itemsStore.onSortUpdate({ dir: sort.value.dir === 'asc' ? 'desc' : 'asc' })
  applyFetchResult(res)
}

const onRentItem = (item: any) => {
  rentDialogRef.value?.open(item)
}

const openItem = (itemId: string) => {
  router.push(`/item/${itemId}`)
}

const onFilterUpdate = async (payload: { field: 'category' | 'tags' | 'statuses'; value: string[] }) => {
  const res: any[] = await itemsStore.updateFilters(payload)
  applyFetchResult(res)
}

const onResetFilters = async () => {
  itemsStore.resetFilters()
  itemsStore.reset()
  const res: any[] = await itemsStore.fetch()
  applyFetchResult(res)
}

const updateHasMoreFromStore = () => {
  hasMore.value = !(lastFetchCount.value === 0 || lastFetchCount.value < limit.value)
}

watch(lastFetchCount, updateHasMoreFromStore)

watch(filtersOpen, (open) => {
  if (open) {
    filtersDialogRef.value?.showModal()
  } else {
    filtersDialogRef.value?.close()
  }
})

onMounted(loadInitial)

onMounted(() => {
  loadMoreObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        loadMore()
      }
    },
    { rootMargin: '200px 0px' },
  )
  if (loadMoreTrigger.value) {
    loadMoreObserver.observe(loadMoreTrigger.value)
  }
})

watch(loadMoreTrigger, (target) => {
  if (!loadMoreObserver || !target) return
  loadMoreObserver.observe(target)
})

onBeforeUnmount(() => {
  loadMoreObserver?.disconnect()
  loadMoreObserver = null
})
</script>

<template>
  <section class="max-w-6xl mx-auto px-4 py-6 space-y-6">
    <dialog ref="filtersDialogRef" class="modal" @close="filtersOpen = false">
      <div class="modal-box max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-lg">Filtri</h3>
          <button class="btn btn-sm btn-ghost" type="button" @click="filtersOpen = false">Zapri</button>
        </div>
        <SidebarFilters
          :sort="sort"
          @updateFilters="onFilterUpdate"
          @resetFilters="onResetFilters"
          @sortField="onSortField"
          @sortDir="onSortDir"
        />
        <div class="mt-4 flex justify-end">
          <button class="btn btn-primary" type="button" @click="filtersOpen = false">Uporabi filtre</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="filtersOpen = false">close</button>
      </form>
    </dialog>

    <div class="grid grid-cols-1 !mt-0 gap-0 md:gap-6 md:grid-cols-[240px_1fr]">
      <aside class="order-1 md:order-1 w-full hidden md:block">
        <SidebarFilters
          :sort="sort"
          @updateFilters="onFilterUpdate"
          @resetFilters="onResetFilters"
          @sortField="onSortField"
          @sortDir="onSortDir"
        />
      </aside>

      <div class="space-y-4 order-2 md:order-2">
        <div v-if="items?.length">
          <div class="space-y-4">
            <div v-for="item in items" :key="item._id" class="cursor-pointer" @click="openItem(item._id)">
              <ItemCard :item="item" @rent="onRentItem(item)" />
            </div>
          </div>
        </div>
        <div v-else class="text-center text-base-content/70">Ni rezultatov iskanja</div>

        <div ref="loadMoreTrigger" class="h-6"></div>
        <div class="flex justify-center">
          <div v-if="loading" class="flex items-center gap-2 text-sm text-base-content/60">
            <span class="loading loading-spinner loading-sm"></span>
            Nalaganje...
          </div>
          <div v-else-if="!hasMore" class="text-sm text-base-content/60">Konec seznama</div>
        </div>
      </div>
    </div>

    <RentDialog ref="rentDialogRef" />
  </section>
</template>
