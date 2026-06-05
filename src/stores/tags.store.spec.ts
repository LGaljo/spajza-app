import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockApiFetch = vi.fn()

// Define globals before importing the store
globalThis.useRuntimeConfig = () => ({
  public: {
    apiUrl: 'http://localhost:4500',
  },
})
globalThis.useApiFetch = () => mockApiFetch

// Import store after globals are set
import { useTagsStore } from './tags.store'

// Mocking toastify
vi.mock('vue3-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    POSITION: { TOP_CENTER: 'top-center' },
    THEME: { DARK: 'dark' },
  },
  default: {
    install: vi.fn(),
  },
}))

describe('Tags Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('initial state should be empty list, not loading, and no error', () => {
    const store = useTagsStore()
    expect(store.list).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('fetch updates state on success', async () => {
    const mockTags = [{ _id: '1', name: 'Fragile' }]
    mockApiFetch.mockResolvedValueOnce(mockTags)

    const store = useTagsStore()
    const result = await store.fetch()

    expect(result).toEqual(mockTags)
    expect(store.list).toEqual(mockTags)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(mockApiFetch).toHaveBeenCalledWith('http://localhost:4500/tags', {
      query: {},
    })
  })

  it('fetch updates state on error', async () => {
    const mockError = new Error('Fetch failed')
    mockApiFetch.mockRejectedValueOnce(mockError)

    const store = useTagsStore()
    await expect(store.fetch()).rejects.toThrow('Fetch failed')

    expect(store.list).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBe(mockError)
  })

  it('remove deletes a tag and calls api', async () => {
    mockApiFetch.mockResolvedValueOnce({ success: true })

    const store = useTagsStore()
    const result = await store.remove('1')

    expect(result).toEqual({ success: true })
    expect(mockApiFetch).toHaveBeenCalledWith('http://localhost:4500/tags/1', {
      method: 'DELETE',
    })
  })

  it('unset clears list', () => {
    const store = useTagsStore()
    store.list = [{ _id: '1', name: 'Fragile' }]
    store.unset()
    expect(store.list).toBeNull()
  })
})
