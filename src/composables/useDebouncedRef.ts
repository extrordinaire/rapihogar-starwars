import { ref, watch } from 'vue'
import { Temporal } from 'temporal-polyfill'

export function useDebouncedRef<T>(params: { initial_value: T, delay: Temporal.DurationLike, abort_signal?: AbortSignal }) {
  const value = ref(params.initial_value)
  const debounced_value = ref(params.initial_value)

  let timer: ReturnType<typeof setTimeout> | null = null
  watch(value, () => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      debounced_value.value = value.value
    },
      Temporal.Duration.from(params.delay).total({ unit: 'milliseconds', relativeTo: Temporal.Now.zonedDateTimeISO() }),
    )
  })

  return {
    value: value,
    debounced_value: debounced_value,
  }
}

