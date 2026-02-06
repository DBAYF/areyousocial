// UI state store using Zustand

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface ModalState {
  id: string
  isOpen: boolean
  data?: any
}

interface UiState {
  // Modal states
  modals: Record<string, ModalState>

  // Sidebar states
  sidebarOpen: boolean
  sidebarCollapsed: boolean

  // Loading states
  globalLoading: boolean
  loadingStates: Record<string, boolean>

  // Notification states
  toastQueue: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    description?: string
    duration?: number
  }>

  // Form states
  formStates: Record<string, {
    isSubmitting: boolean
    errors: Record<string, string>
  }>

  // Actions
  openModal: (id: string, data?: any) => void
  closeModal: (id: string) => void
  toggleModal: (id: string, data?: any) => void
  closeAllModals: () => void

  setSidebarOpen: (open: boolean) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void

  setGlobalLoading: (loading: boolean) => void
  setLoadingState: (key: string, loading: boolean) => void

  addToast: (toast: Omit<UiState['toastQueue'][0], 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void

  setFormSubmitting: (formId: string, submitting: boolean) => void
  setFormErrors: (formId: string, errors: Record<string, string>) => void
  clearFormErrors: (formId: string) => void
}

export const useUiStore = create<UiState>()(
  devtools(
    (set, get) => ({
      // Initial state
      modals: {},
      sidebarOpen: false,
      sidebarCollapsed: false,
      globalLoading: false,
      loadingStates: {},
      toastQueue: [],
      formStates: {},

      // Modal actions
      openModal: (id: string, data?: any) => {
        set((state) => ({
          modals: {
            ...state.modals,
            [id]: { id, isOpen: true, data }
          }
        }))
      },

      closeModal: (id: string) => {
        set((state) => ({
          modals: {
            ...state.modals,
            [id]: { ...state.modals[id], isOpen: false }
          }
        }))
      },

      toggleModal: (id: string, data?: any) => {
        const state = get()
        const modal = state.modals[id]
        if (modal?.isOpen) {
          state.closeModal(id)
        } else {
          state.openModal(id, data)
        }
      },

      closeAllModals: () => {
        set((state) => ({
          modals: Object.keys(state.modals).reduce((acc, id) => ({
            ...acc,
            [id]: { ...state.modals[id], isOpen: false }
          }), {})
        }))
      },

      // Sidebar actions
      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open })
      },

      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed })
      },

      toggleSidebar: () => {
        const state = get()
        set({ sidebarOpen: !state.sidebarOpen })
      },

      // Loading actions
      setGlobalLoading: (loading: boolean) => {
        set({ globalLoading: loading })
      },

      setLoadingState: (key: string, loading: boolean) => {
        set((state) => ({
          loadingStates: {
            ...state.loadingStates,
            [key]: loading
          }
        }))
      },

      // Toast actions
      addToast: (toast) => {
        const id = Date.now().toString()
        set((state) => ({
          toastQueue: [
            ...state.toastQueue,
            { ...toast, id }
          ]
        }))

        // Auto remove toast after duration
        if (toast.duration !== 0) {
          setTimeout(() => {
            get().removeToast(id)
          }, toast.duration || 4000)
        }
      },

      removeToast: (id: string) => {
        set((state) => ({
          toastQueue: state.toastQueue.filter(toast => toast.id !== id)
        }))
      },

      clearToasts: () => {
        set({ toastQueue: [] })
      },

      // Form actions
      setFormSubmitting: (formId: string, submitting: boolean) => {
        set((state) => ({
          formStates: {
            ...state.formStates,
            [formId]: {
              ...state.formStates[formId],
              isSubmitting: submitting
            }
          }
        }))
      },

      setFormErrors: (formId: string, errors: Record<string, string>) => {
        set((state) => ({
          formStates: {
            ...state.formStates,
            [formId]: {
              ...state.formStates[formId],
              errors
            }
          }
        }))
      },

      clearFormErrors: (formId: string) => {
        set((state) => ({
          formStates: {
            ...state.formStates,
            [formId]: {
              ...state.formStates[formId],
              errors: {}
            }
          }
        }))
      },
    }),
    {
      name: 'ui-store',
    }
  )
)

// Selectors
export const useModal = (id: string) => useUiStore((state) => state.modals[id])
export const useIsModalOpen = (id: string) => useUiStore((state) => state.modals[id]?.isOpen || false)
export const useSidebarOpen = () => useUiStore((state) => state.sidebarOpen)
export const useSidebarCollapsed = () => useUiStore((state) => state.sidebarCollapsed)
export const useGlobalLoading = () => useUiStore((state) => state.globalLoading)
export const useLoadingState = (key: string) => useUiStore((state) => state.loadingStates[key])
export const useToastQueue = () => useUiStore((state) => state.toastQueue)
export const useFormState = (formId: string) => useUiStore((state) => state.formStates[formId])