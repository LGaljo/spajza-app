export const useApiFetch = () => {
  const { $apiFetch } = useNuxtApp()
  return $apiFetch
}
