<script setup lang="ts">
import { computed } from 'vue'

type ChangeField = {
  key: string
  type: 'changed' | 'added' | 'removed'
  valueBefore?: string
  valueNow?: string
}

type ChangeEntry = {
  id?: string
  _createdAt: string
  user?: { username: string }
  changes?: ChangeField[]
}

const props = defineProps<{
  changes: ChangeEntry[]
}>()

const fields = [
  { field: 'name', name: 'Ime' },
  { field: '_createdAt', name: 'Čas pridobitve' },
  { field: '_updatedAt', name: 'Čas posodobitve' },
  { field: 'code', name: 'Inv. št.' },
  { field: 'owner', name: 'Lastnik' },
  { field: 'location', name: 'Mesto' },
  { field: 'count', name: 'število' },
  { field: 'tags', name: 'Značke' },
  { field: 'description', name: 'Opis' },
  { field: 'borrower', name: 'Opis' },
  { field: 'retired', name: 'Odpisan' },
  { field: 'status', name: 'Status' },
  { field: 'category', name: 'Kategorija' },
  { field: 'boughtTime', name: 'Čas pridobitve' },
  { field: 'file', name: 'Slika' },
  { field: 'cover', name: 'Slika' },
  { field: 'rents', name: 'Izposoja' },
  { field: 'renter', name: 'Izposojevalec' },
  { field: 'extras', name: 'Dodatno', ignore: true },
]

const getFieldName = (field: string) => fields.find((entry) => entry.field === field)?.name ?? field

const formatDateTime = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

const hasChanges = computed(() => props.changes && props.changes.length > 0)
</script>

<template>
  <div class="card bg-base-100 shadow mt-6">
    <div class="card-body">
      <details>
        <summary class="cursor-pointer font-semibold">Spremembe</summary>
        <div class="mt-4">
          <div v-if="hasChanges">
            <div
              v-for="(change, idx) in changes"
              :key="change.id ?? idx"
              :class="['py-3', { 'border-b border-base-200': idx !== changes.length - 1 }]"
            >
              <div class="flex flex-wrap justify-between gap-2 mb-2">
                <span class="badge">{{ formatDateTime(change._createdAt) }}</span>
                <span v-if="change.user">Avtor: <b>{{ change.user.username }}</b></span>
              </div>
              <div v-for="(field, fieldIdx) in change.changes" :key="fieldIdx" class="space-y-1 text-sm">
                <div v-if="field.type === 'changed'">Spremenjeno polje: <b>{{ getFieldName(field.key) }}</b></div>
                <div v-else-if="field.type === 'added'">Dodano polje: <b>{{ getFieldName(field.key) }}</b></div>
                <div v-else-if="field.type === 'removed'">Odstranjeno polje: <b>{{ getFieldName(field.key) }}</b></div>
                <div v-if="field.valueBefore">Pretekla vrednost: <b>{{ field.valueBefore }}</b></div>
                <div v-if="field.valueNow">Nova vrednost: <b>{{ field.valueNow }}</b></div>
              </div>
            </div>
          </div>
          <div v-else class="text-center font-semibold">Ni sprememb</div>
        </div>
      </details>
    </div>
  </div>
</template>
