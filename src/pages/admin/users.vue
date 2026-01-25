<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { toast } from 'vue3-toastify'
import ModalDialog from '~/components/modals/ModalDialog.vue'

definePageMeta({
  layout: 'default',
})

type RoleOption = { text: string; value: string; color: string }

const roles: RoleOption[] = [
  { text: 'Administrator', value: 'ADMIN', color: 'badge-warning' },
  { text: 'Uporabnik', value: 'USER', color: 'badge-info' },
  { text: 'Gospodar', value: 'KEEPER', color: 'badge-success' },
  { text: 'Nepotrjen', value: 'UNAPPROVED', color: 'badge-secondary' },
]

const runtimeConfig = useRuntimeConfig()
const apiFetch = useApiFetch()
const users = ref<any[]>([])
const actionId = ref<string | null>(null)
const innerWidth = ref(1000)
const dialogRef = ref<InstanceType<typeof ModalDialog> | null>(null)

const hideOnMinWidth = computed(() => innerWidth.value > 800)

const getRoleMeta = (role: string) => roles.find((entry) => entry.value === role)

const getUsers = async () => {
  try {
    users.value = await apiFetch(`/users`)
  } catch (err) {
    console.error(err)
    toast.error('Napaka pri pridobivanju uporabnikov', { autoClose: 3000 })
  }
}

const updateRole = async (user: any, role: string) => {
  try {
    const res: any = await apiFetch(`/users/${user._id}/role`, {
      method: 'PUT',
      body: { role },
    })
    const found = users.value.find((entry) => entry._id === res?._id)
    if (found) found.role = res.role
  } catch (err) {
    console.error(err)
    toast.error('Napaka pri posodabljanju vloge', { autoClose: 3000 })
  }
}

const openDisable = (userId: string) => {
  actionId.value = userId
  dialogRef.value?.open()
}

const removeUser = async () => {
  if (!actionId.value) return
  try {
    await apiFetch(`/users/${actionId.value}`, {
      method: 'DELETE',
    })
    toast.success('Uporabnik onemogočen', { autoClose: 3000 })
    await getUsers()
  } catch (err) {
    console.error(err)
    toast.error('Napaka', { autoClose: 3000 })
  } finally {
    actionId.value = null
  }
}

const onResize = () => {
  innerWidth.value = window.innerWidth
}

onMounted(() => {
  innerWidth.value = window.innerWidth
  window.addEventListener('resize', onResize)
  getUsers()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <section class="max-w-5xl mx-auto px-4 py-8">
    <div class="text-center">
      <h1 class="text-3xl font-semibold">Uporabniki</h1>
    </div>

    <div class="overflow-x-auto mt-6">
      <table class="table table-zebra w-full">
        <thead>
          <tr>
            <th>Up. ime</th>
            <th v-if="hideOnMinWidth">Email</th>
            <th>Vloga</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td>{{ user.username }}</td>
            <td v-if="hideOnMinWidth">{{ user.email }}</td>
            <td>
              <select
                class="select select-bordered select-sm"
                :value="user.role"
                @change="updateRole(user, ($event.target as HTMLSelectElement).value)"
              >
                <option v-for="role in roles" :key="role.value" :value="role.value">{{ role.text }}</option>
              </select>
              <span v-if="getRoleMeta(user.role)" class="badge ml-2" :class="getRoleMeta(user.role)?.color">
                {{ getRoleMeta(user.role)?.text }}
              </span>
            </td>
            <td>
              <button class="btn btn-warning btn-sm" @click="openDisable(user._id)">Onemogoči</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog ref="dialogRef" title="Želiš onemogočiti uporabnika?" action="Onemogoči" @first="removeUser">
      <template #body>Uporabniku boš onemogočil dostop do portala</template>
    </ModalDialog>
  </section>
</template>
