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
import { useCategoriesStore } from './categories.store'

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

describe('Categories Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('initial state should be empty list, not loading, and no error', () => {
    const store = useCategoriesStore()
    expect(store.list).toEqual([])
    expect(store.category).toBeNull()
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('fetchOne updates state on success', async () => {
    const mockCat = { _id: '1', name: 'Electronics' }
    mockApiFetch.mockResolvedValueOnce(mockCat)

    const store = useCategoriesStore()
    const result = await store.fetchOne('1')

    expect(result).toEqual(mockCat)
    expect(store.category).toEqual(mockCat)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(mockApiFetch).toHaveBeenCalledWith('http://localhost:4500/categories/1')
  })

  it('fetchOne updates state on error', async () => {
    const mockError = new Error('Fetch one failed')
    mockApiFetch.mockRejectedValueOnce(mockError)

    const store = useCategoriesStore()
    await expect(store.fetchOne('1')).rejects.toThrow('Fetch one failed')

    expect(store.category).toBeNull()
    expect(store.loading).toBe(false)
    expect(store.error).toBe(mockError)
  })

  it('fetch updates state on success', async () => {
    const mockCats = [{ _id: '1', name: 'Electronics' }]
    mockApiFetch.mockResolvedValueOnce(mockCats)

    const store = useCategoriesStore()
    const result = await store.fetch()

    expect(result).toEqual(mockCats)
    expect(store.list).toEqual(mockCats)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(mockApiFetch).toHaveBeenCalledWith('http://localhost:4500/categories', {
      query: {},
    })
  })

  it('fetch updates state on error', async () => {
    const mockError = new Error('Fetch failed')
    mockApiFetch.mockRejectedValueOnce(mockError)

    const store = useCategoriesStore()
    await expect(store.fetch()).rejects.toThrow('Fetch failed')

    expect(store.list).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBe(mockError)
  })

  it('remove deletes a category and calls api', async () => {
    mockApiFetch.mockResolvedValueOnce({ success: true })

    const store = useCategoriesStore()
    const result = await store.remove('1')

    expect(result).toEqual({ success: true })
    expect(mockApiFetch).toHaveBeenCalledWith('http://localhost:4500/categories/1', {
      method: 'DELETE',
    })
  })

  it('unset clears list', () => {
    const store = useCategoriesStore()
    store.list = [{ _id: '1', name: 'Electronics' }]
    store.unset()
    expect(store.list).toBeNull()
  })
})
