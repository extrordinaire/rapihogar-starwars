import { ref, watch } from 'vue'

export function useDebouncedRef<T>(params: {
  initial_value: T
  delay_ms: number
  abort_signal?: AbortSignal
}) {
  const value = ref(params.initial_value)
  const debounced_value = ref(params.initial_value)

  let timer: ReturnType<typeof setTimeout> | null = null
  watch(value, () => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      debounced_value.value = value.value
    }, params.delay_ms)
  })

  return {
    value: value,
    debounced_value: debounced_value,
  }
}
