<script setup lang="ts">
import { computed } from 'vue'
import { useItemsStore } from '~/stores/items.store'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/24/solid'

type SortOption = { text: string; value: string }
type SortState = { field: string; dir: string; options: SortOption[] }

const itemsStore = useItemsStore()

const filters = computed(() => itemsStore.filters)
const selected = computed(() => itemsStore.selected)
const showFilterClear = computed(
  () => selected.value?.category?.length || selected.value?.tags?.length || selected.value?.statuses?.length,
)

const props = defineProps<{
  sort: SortState
}>()

const emit = defineEmits<{
  (event: 'updateFilters', payload: { field: 'category' | 'tags' | 'statuses'; value: string[] }): void
  (event: 'resetFilters'): void
  (event: 'sortField', field: string): void
  (event: 'sortDir'): void
}>()

const toggleFilter = (key: 'category' | 'tags' | 'statuses') => {
  itemsStore.toggleFilter(key)
}
</script>

<template>
  <div class="card bg-base-100 shadow-sm border border-base-200">
    <div class="card-body p-4 space-y-3">
      <div class="space-y-2 border-b border-base-200/60 pb-3">
        <div class="font-semibold text-sm tracking-wide uppercase text-base-content/80">Sortiranje</div>
        <div class="flex items-center gap-2">
          <select
            class="select select-bordered select-sm w-full"
            :value="props.sort.field"
            @change="emit('sortField', ($event.target as HTMLSelectElement).value)"
          >
            <option v-for="option in props.sort.options" :key="option.value" :value="option.value">
              {{ option.text }}
            </option>
          </select>
          <button
            class="btn btn-sm btn-outline btn-square text-base-content"
            type="button"
            aria-label="Preklopi smer sortiranja"
            @click="emit('sortDir')"
          >
            <ChevronUpIcon v-if="props.sort.dir === 'asc'" class="w-5 h-5 text-base-content" />
            <ChevronDownIcon v-else class="w-5 h-5 text-base-content" />
          </button>
        </div>
      </div>

      <div v-for="(filter, key) in filters" :key="key" class="space-y-2 border-b border-base-200/60 pb-3 last:border-b-0 last:pb-0">
        <button
          class="w-full flex items-center justify-between py-2 px-2 rounded-md hover:bg-base-200 transition-colors"
          @click="toggleFilter(key)"
        >
          <span class="font-semibold text-sm tracking-wide uppercase text-base-content/80">{{ filter.name }}</span>
          <span class="text-base-content/60 text-lg leading-none">{{ filter.visible ? '−' : '+' }}</span>
        </button>
        <div v-if="filter.visible" class="pl-2 pb-2 space-y-2">
          <label
            v-for="value in filter.values"
            :key="value[filter.valueKey]"
            class="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-base-200/70 transition-colors"
          >
            <input
              v-if="filter.type === 'multiple'"
              type="checkbox"
              class="checkbox checkbox-sm"
              :value="value[filter.valueKey]"
              :checked="selected[key].includes(value[filter.valueKey])"
              @change="
                emit('updateFilters', {
                  field: key,
                  value: selected[key].includes(value[filter.valueKey])
                    ? selected[key].filter((entry) => entry !== value[filter.valueKey])
                    : [...selected[key], value[filter.valueKey]],
                })
              "
            />
            <span class="text-sm">{{ value[filter.nameKey] }}</span>
          </label>
        </div>
      </div>

      <button v-if="showFilterClear" class="btn btn-sm btn-outline w-full" @click="emit('resetFilters')">
        Počisti filtre
      </button>
    </div>
  </div>
</template>
