<script lang="ts">
import { elementScroll, useVirtualizer } from '@tanstack/vue-virtual'
import { computed, ref } from 'vue'

const skeletons = computed(() => {
  if (search_query.isLoading.value || search_query.isError.value) {
    return Array.from({ length: 10 })
  }
  return []
})

const characters = computed(() => {
  if (search_query.isSuccess.value) {
    return search_query.data.value!
  }
  return []
})

const virtual_parent_ref = ref<HTMLElement | null>(null)

const virtualizer_options = computed(() => ({
  horizontal: true,
  count: skeletons.value.length + characters.value.length,
  estimateSize: () => 320,
  scrollMargin: virtual_parent_ref.value?.offsetWidth ?? 0,
  getScrollElement: () => virtual_parent_ref.value,
  overscan: 5,
  scrollToFn: elementScroll,
}))

const virtualizer = useVirtualizer(virtualizer_options)

const virtual_rows = computed(() => virtualizer.value.getVirtualItems())
const total_size = computed(() => virtualizer.value.getTotalSize())
</script>

<template>
  <div
    ref="virtual_parent_ref"
    class="w-full h-96 py-10 overflow-x-auto overflow-y-hidden scroll-smooth"
  >
    <!-- SPACER -->
    <div class="md:h-full relative" :style="{ width: `${total_size}px` }">
      <!-- VISIBLE ITEMS -->
      <div
        class="absolute top-0 left-0 h-full"
        :style="{
          transform: `translateX(${virtual_rows[0]?.start - virtualizer.options.scrollMargin}px)`,
        }"
      >
        <!-- ITEMS -->
        <div
          v-for="virtual_row in virtual_rows"
          :key="`${virtual_row.key}`"
          :data-index="virtual_row.index"
          :ref="
            (el) => {
              // @ts-ignore
              virtualizer.measureElement(el)
            }
          "
          class="inline-block"
        >
          <div style="padding: 0 10px">
            <div>Column {{ virtual_row.index }}</div>
            <CharacterCard
              :character_name="characters[virtual_row.index]?.properties.name"
              :gender="characters[virtual_row.index]?.properties.gender"
              :uid="characters[virtual_row.index]?.uid"
              :query_status="search_query.status.value"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
