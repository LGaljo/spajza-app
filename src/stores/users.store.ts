import { defineStore } from 'pinia'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import type { RegistrationData } from '~/lib/interfaces'
import type { User } from '~/lib/types'

export const useUserStore = defineStore('users', () => {
  const user = ref<User | null>(null)
  const token = ref('')
  const error = ref<string | null>(null)
  const loading = ref(false)
  const runtimeConfig = useRuntimeConfig()
  const router = useRouter()
  const apiFetch = useApiFetch()

  const fetchUser = async (userId: string) => {
    const data = await apiFetch<User>(runtimeConfig.public.apiUrl + '/users/' + userId)
    user.value = data
  }

  const registration = async (data: RegistrationData) => {
    await apiFetch(runtimeConfig.public.apiUrl +  '/users', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((res: any) => {
        console.log(res)
        if (!res.success) {
          if (res?.code === 11000 && res?.key?.email) {
            error.value = `Uporabnik z emailom "${res?.key?.email}" že obstaja`;
          } else if (res?.code === 11000 && res?.key?.username) {
            error.value = `Uporabnik z uporabniškim imenom "${res?.key?.username}" že obstaja`;
          }
        } else {
          router.replace({ path: '/registration/complete', query: { userId: res?.user?._id }})
        }
      })
      .catch((err) => {
        console.log(err)
        toast.error(err.message)
      })
  }

  return {
    error,
    loading,
    token,
    user,
    fetchUser,
    registration,
  }
})


