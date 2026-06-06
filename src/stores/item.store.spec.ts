import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { InventoryItem } from '~/lib/types'

const mockApiFetch = vi.fn()

// Define globals before importing the store
globalThis.useRuntimeConfig = () => ({
  public: {
    apiUrl: 'http://localhost:4500',
  },
})
globalThis.useApiFetch = () => mockApiFetch

// Import store after globals are set
import { useItemStore } from './item.store'

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

describe('Item Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('initial state should have null item, not loading, and no error', () => {
    const store = useItemStore()
    expect(store.item).toBeNull()
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('fetch updates state on success', async () => {
    const mockItem: InventoryItem = { _id: '1', name: 'Tent' }
    mockApiFetch.mockResolvedValueOnce(mockItem)

    const store = useItemStore()
    const result = await store.fetch('1')

    expect(result).toEqual(mockItem)
    expect(store.item).toEqual(mockItem)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(mockApiFetch).toHaveBeenCalledWith('http://localhost:4500/inventory/1')
  })

  it('fetch updates state on error', async () => {
    const mockError = new Error('Fetch failed')
    mockApiFetch.mockRejectedValueOnce(mockError)

    const store = useItemStore()
    await expect(store.fetch('1')).rejects.toThrow('Fetch failed')

    expect(store.item).toBeNull()
    expect(store.loading).toBe(false)
    expect(store.error).toBe(mockError)
  })

  it('update calls api and sets item', async () => {
    const mockItem: InventoryItem = { _id: '1', name: 'Updated Tent' }
    mockApiFetch.mockResolvedValueOnce(mockItem)

    const store = useItemStore()
    const result = await store.update(mockItem)

    expect(result).toEqual(mockItem)
    expect(store.item).toEqual(mockItem)
    expect(mockApiFetch).toHaveBeenCalledWith('http://localhost:4500/inventory/1', {
      method: 'PUT',
      body: mockItem,
    })
  })

  it('unset clears item', () => {
    const store = useItemStore()
    store.item = { _id: '1', name: 'Tent' }
    store.unset()
    expect(store.item).toBeNull()
  })
})
