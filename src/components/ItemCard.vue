<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  item: any
}>()

const emit = defineEmits<{
  (event: 'rent'): void
}>()

const statusMeta: Record<string, { text: string; class: string }> = {
  NEW: { text: 'Novo', class: 'badge-info' },
  BORROWED: { text: 'Izposojeno', class: 'badge-warning' },
  STORED: { text: 'Na voljo', class: 'badge-success' },
  WRITTEN_OFF: { text: 'Odpisano', class: 'badge-secondary' },
}

const coverUrl = computed(() => props.item?.cover?.[0]?.Location ?? null)
</script>

<template>
  <div class="card card-side bg-base-100 shadow items-stretch overflow-hidden">
    <figure class="w-32 sm:w-44 aspect-square bg-base-200 shrink-0">
      <img v-if="coverUrl" :src="coverUrl" alt="cover" class="object-cover w-full h-full" />
      <div v-else class="w-full h-full flex items-center justify-center text-xs text-base-content/60">Ni slike</div>
    </figure>
    <div class="card-body p-3 sm:p-4 min-w-0">
      <div class="flex items-start justify-between gap-2 min-w-0">
        <div class="min-w-0">
          <h3 class="text-lg font-semibold truncate max-w-full">{{ item.name }}</h3>
          <div v-if="item.status" class="badge mt-1" :class="statusMeta[item.status]?.class">
            {{ statusMeta[item.status]?.text ?? item.status }}
          </div>
        </div>
        <div class="text-sm text-base-content/70 whitespace-nowrap">#{{ item.code }}</div>
      </div>

      <div v-if="item.tags?.length" class="flex flex-wrap gap-1">
        <span v-for="tag in item.tags" :key="tag._id" class="badge badge-secondary">{{ tag.name }}</span>
      </div>

      <div class="mt-1 text-sm text-base-content/80 space-y-1 min-w-0">
        <div v-if="item.category?.name">
          <span class="badge badge-primary">{{ item.category.name }}</span>
        </div>
        <div v-if="item.count > 1"><b>Število:</b> {{ item.count }}</div>
        <div v-if="item.location"><b>Lokacija:</b> {{ item.location }}</div>
        <div v-if="item.description" class="max-h-12 overflow-hidden break-words">{{ item.description }}</div>
      </div>

      <div class="card-actions justify-end">
        <button
          v-if="item.status !== 'BORROWED'"
          class="btn btn-sm btn-outline"
          @click.stop.prevent="emit('rent')"
        >
          Izposodi
        </button>
      </div>
    </div>
  </div>
</template>
