import { defineStore } from 'pinia'
import type { ChangePassData, ExtChangePassData, LoginData, ResendData, VerificationData } from '~/lib/interfaces'
import { computed, ref } from 'vue'
import { toast } from 'vue3-toastify'
import { useRouter } from '#vue-router'
import { Role } from '~/lib/types'
import type { User } from '~/lib/types'

export const useAuthStore = defineStore('auth', () => {
  const user: Ref = ref<User | null>(null)
  const token: Ref = ref('')
  const error: Ref = ref(null)
  const loading = ref(false)

  const runtimeConfig = useRuntimeConfig()
  const router = useRouter()
  const apiFetch = useApiFetch()

  const isAdmin = computed(() => user.value?.role === Role.ADMIN)
  const isKeeper = computed(() => user.value?.role === Role.KEEPER)
  const isApproved = computed(() => !!user.value && user.value?.role !== Role.UNAPPROVED)
  const isNormalUser = computed(() => user.value?.role === Role.USER)

  const fetchUser = async (userId: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await apiFetch<User>(`/users/${userId}`)
      user.value = res
      return res
    } catch (err) {
      console.error(err)
      user.value = null
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  const login = async (data: LoginData) => {
    loading.value = true
    error.value = null
    try {
      const res: any = await apiFetch(`/auth/login`, {
        method: 'POST',
        body: data,
      })
      if (res?.success) {
        token.value = res?.data?.access_token ?? ''
        user.value = res?.data?.user ?? null
        if (import.meta.client) {
          localStorage.setItem('jwt', res?.data?.access_token)
          localStorage.setItem('userId', res?.data?.user?._id ?? '')
        }
        await router.replace('/')
        return res
      }
      if (!res?.success && res?.reason === 'UNAPPROVED') {
        return {
          resend_act: res?.userId,
          error: 'Uporabnik še ni aktiviran. Najdi email s povezavo.',
        }
      }
      if (res?.data?.access_token) {
        token.value = res?.data?.access_token ?? ''
        user.value = res?.data?.user ?? null
        if (import.meta.client) {
          localStorage.setItem('jwt', res?.data?.access_token)
          localStorage.setItem('userId', res?.data?.user?._id ?? '')
        }
        await router.replace('/')
        return res
      }
      return res
    } catch (err: any) {
      console.error(err)
      if (err?.status === 401) {
        error.value = 'Napačni prijavni podatki'
      } else {
        toast.error(err?.message ?? 'Napaka pri prijavi', {
          position: 'top-right',
          autoClose: 5000,
        })
      }
      return Promise.reject({
        resend_act: null,
        error: 'Napačni prijavni podatki',
      })
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    localStorage.removeItem('jwt')
    localStorage.removeItem('userId')
    await router.replace('/login')
  }

  const unsetUser = () => {
    user.value = null
    token.value = ''
    if (import.meta.client) {
      localStorage.removeItem('jwt')
      localStorage.removeItem('userId')
    }
  }

  const changePassword = async (data: ChangePassData) => {
    loading.value = true
    await apiFetch('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        toast.success('Geslo uspešno spremenjeno!', {
          autoClose: 2000,
          position: toast.POSITION.TOP_CENTER,
        })
      })
      .catch((error) => {
        console.log(error)
        toast.error('Napaka!', {
          autoClose: 2000,
          position: toast.POSITION.TOP_CENTER,
        })
      })
      .finally(() => {
        loading.value = false
      })
  }

  const changePasswordExternal = async (data: ExtChangePassData) => {
    loading.value = true
    await apiFetch('/auth/ext-change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        toast.success('Geslo uspešno spremenjeno!', {
          autoClose: 2000,
          position: toast.POSITION.TOP_CENTER,
        })
      })
      .catch((error) => {
        console.log(error)
        toast.error('Napaka!', {
          autoClose: 2000,
          position: toast.POSITION.TOP_CENTER,
        })
      })
      .finally(() => {
        loading.value = false
      })
  }

  const requestPasswordChange = async (data: ResendData) => {
    loading.value = true
    await apiFetch('/auth/request-password-change', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        toast.success('Zahteva uspešno poslana!', {
          autoClose: 2000,
          position: toast.POSITION.TOP_CENTER,
        })
      })
      .catch((error) => {
        console.log(error)
        toast.error('Napaka!', {
          autoClose: 2000,
          position: toast.POSITION.TOP_CENTER,
        })
      })
      .finally(() => {
        loading.value = false
      })
  }

  const profileVerification = async (data: VerificationData) => {
    loading.value = true
    await apiFetch('/auth/verification', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        setTimeout(() => {
          router.replace('/login')
        }, 5000)
      })
      .catch((error) => {
        console.log(error)
        toast.error('Napaka pri zahtevi!', {
          autoClose: 2000,
          position: toast.POSITION.TOP_CENTER,
        })
      })
      .finally(() => {
        loading.value = false
      })
  }

  const resendProfileVerification = async (userId: string) => {
    loading.value = true
    await apiFetch('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    })
      .then(() => {
        setTimeout(() => {
          router.replace('/login')
        }, 5000)
      })
      .catch((error) => {
        console.log(error)
        toast.error('Napaka pri zahtevi!', {
          autoClose: 2000,
          position: toast.POSITION.TOP_CENTER,
        })
      })
      .finally(() => {
        loading.value = false
      })
  }

  return {
    user,
    token,
    error,
    loading,
    isAdmin,
    isKeeper,
    isApproved,
    isNormalUser,
    fetchUser,
    login,
    logout,
    unsetUser,
    changePassword,
    changePasswordExternal,
    requestPasswordChange,
    profileVerification,
    resendProfileVerification,
  }
})
