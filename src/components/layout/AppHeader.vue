<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from '#vue-router'
import { FunnelIcon } from '@heroicons/vue/24/solid'
import { useItemsStore } from '~/stores/items.store'
import { useAuthStore } from '~/stores/auth.store'

const router = useRouter()
const route = useRoute()
const itemsStore = useItemsStore()
const { search } = storeToRefs(itemsStore)
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const filtersOpen = useState<boolean>('filtersDialogOpen', () => false)
const showSearch = computed(() => route.path === '/')
const hasHydrated = ref(false)
onMounted(() => {
  hasHydrated.value = true
})
const avatarLetter = computed(() => {
  if (!hasHydrated.value) return 'U'
  return user.value?.username?.charAt(0)?.toUpperCase() ?? 'U'
})

const searchValue = computed({
  get: () => search.value ?? '',
  set: (value) => itemsStore.setSearch(value),
})

const onSearch = async () => {
  await itemsStore.updateFilters({ field: 'search', value: searchValue.value })
}

const clearSearch = async () => {
  if (!searchValue.value) return
  searchValue.value = ''
  await itemsStore.updateFilters({ field: 'search', value: '' })
}

const logout = async () => {
  authStore.logout()
}
</script>

<template>
  <div class="bg-base-100">
    <div class="navbar">
      <div class="navbar-start">
        <a class="btn btn-ghost text-3xl atma-semibold d-flex justify-center items-center pt-2" @click="router.push({ path: '/' })">Špajza</a>
      </div>

      <div class="navbar-center hidden md:flex w-full max-w-xl" v-if="showSearch">
        <div class="join w-full">
          <input
            v-model="searchValue"
            type="text"
            class="input input-bordered join-item w-full"
            placeholder="Išči"
            @keydown.enter.prevent="onSearch"
          />
          <button v-if="searchValue" class="btn join-item" @click="clearSearch">Počisti</button>
          <button class="btn btn-primary join-item" @click="onSearch">Išči</button>
        </div>
      </div>

      <div class="navbar-end gap-2">
        <button
          v-if="showSearch"
          class="btn btn-ghost md:hidden"
          type="button"
          @click="filtersOpen = true"
        >
          <FunnelIcon class="w-5 h-5" />
          <span class="text-sm">Filtri</span>
        </button>

        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full flex justify-center content-center uppercase text-xl font-light bg-primary text-white">
              <div>{{ avatarLetter }}</div>
            </div>
          </div>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li><a @click="router.push({ path: '/admin/add'})">Dodaj</a></li>
            <li><a @click="router.push({ path: '/admin/import'})">Uvozi</a></li>
            <li><a @click="router.push({ path: '/admin/tags'})">Značke</a></li>
            <li><a @click="router.push({ path: '/admin/categories'})">Kategorije</a></li>
            <li><a @click="router.push({ path: '/admin/templates'})">Predloge slik kategorij</a></li>
            <li><a @click="router.push({ path: '/admin/users'})">Uporabniki</a></li>
            <li><a @click="router.push({ path: '/profile'})">Profil</a></li>
            <li><a @click="logout">Odjava</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="md:hidden px-4 pb-4" v-if="showSearch">
      <div class="join w-full">
        <input
          v-model="searchValue"
          type="text"
          class="input input-bordered join-item w-full"
          placeholder="Išči"
          @keydown.enter.prevent="onSearch"
        />
        <button v-if="searchValue" class="btn join-item" @click="clearSearch">Počisti</button>
        <button class="btn btn-primary join-item" @click="onSearch">Išči</button>
      </div>
    </div>
  </div>
</template>
