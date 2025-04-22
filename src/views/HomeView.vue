<script setup lang="ts">
import { useDebouncedRef } from '@/composables/useDebouncedRef'
import { computed, ref, watch } from 'vue'

import { useQuery, keepPreviousData } from '@tanstack/vue-query'
import { useVirtualizer, elementScroll } from '@tanstack/vue-virtual'

import CharacterCard from '@/components/CharacterCard.vue'
import SearchBar from '@/components/SearchBar.vue'

import { search_people } from '@/api'
import { Temporal } from 'temporal-polyfill'
import { useUserPreferencesStore } from '@/stores/user_preferences'

const user_preferences = useUserPreferencesStore()

const { value: search, debounced_value: debounced_search } = useDebouncedRef({
  initial_value: user_preferences.search_query,
  delay_ms: Temporal.Duration.from({ milliseconds: 300 }).total('millisecond'),
})
watch(debounced_search, () => {
  user_preferences.search_query = debounced_search.value
})

const selected_species_uid = computed(() => user_preferences.selected_species[1] || null)
const selected_vehicle_uid = computed(() => user_preferences.selected_vehicles[1] || null)

const TAGS_REGEX = /(#[a-zA-Z0-9_-]+)/g

const tags = computed(() => {
  return search.value.match(TAGS_REGEX)
})

function remove_chip(tag: string) {
  search.value = search.value.replace(new RegExp(`\\s*${tag}`, 'g'), '')
}

const search_query = useQuery({
  queryKey: computed(() => ['swapi', 'search', debounced_search.value] as const),
  queryFn: () => search_people({ name: debounced_search.value }),
  enabled: computed(() => debounced_search.value.length > 0),
  placeholderData: keepPreviousData,
  staleTime: Infinity,
})

// const hydrated_queries = useQueries({
//   queries: computed(() => {
//     const raw = []

//     for (const index of virtual_indexes.value) {
//       const character = search_query.data.value?.[index]
//       if (!character) continue

//       raw.push({
//         queryKey: ['swapi', 'people', character.uid] as const,
//         queryFn: () => get_people({ uid: character.uid }),
//         enabled: true,
//         placeholderData: ({
//           result: {
//             properties: {
//               name: character.properties.name,
              
//             },
//             uid: character.uid
//           }
//         })
//       })
//     }
//     return raw as typeof raw
//   }),
// })


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
  count: skeletons.value.length + characters.value?.length,
  estimateSize: () => 320,
  scrollMargin: virtual_parent_ref.value?.offsetWidth ?? 0,
  getScrollElement: () => virtual_parent_ref.value,
  overscan: 5,
  scrollToFn: elementScroll,
}))

const virtualizer = useVirtualizer(virtualizer_options)

const virtual_rows = computed(() => virtualizer.value.getVirtualItems())
const virtual_indexes = computed(()=> virtual_rows.value.map(v => v.index) ?? [])
const total_size = computed(() => virtualizer.value.getTotalSize())

</script>

<template>
  <main class="responsive">
    <div class="flex justify-center w-full">
      <picture class="relative h-96 block aspect-square">
        <img
          src="../assets/logo_star_wars.svg"
          alt="star-wars"
          class="absolute dark:invert h-full"
        />
        <img
          src="../assets/logo_rapihogar.svg"
          alt="rapihogar"
          class="absolute dark:invert grayscale h-1/6 right-0 bottom-1/4 z-10 drop-shadow-lg/100 drop-shadow-black -rotate-12"
        />
      </picture>
    </div>
    <div class="w-full flex items-center flex-col">
      <SearchBar
        v-model:search_query="search"
        @search="(payload) => console.log(payload)"
        @change="
          (e) => {
            selected_species_uid = e.species_filter[1]
            selected_vehicle_uid = e.vehicle_filter[1]
          }
        "
      />
      <div
        class="overflow-x-auto w-full justify-center mask-radial-[50%_90%] mask-radial-from-80% flex flex-row flex-nowrap"
      >
        <button class="chip" v-for="tag in tags" :key="tag" @click="remove_chip(tag)">
          <span>{{ tag }}</span>
          <i>close</i>
        </button>
      </div>
    </div>

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
  </main>
</template>
