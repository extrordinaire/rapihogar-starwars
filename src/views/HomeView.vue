<script setup lang="ts">
import { useDebouncedRef } from '@/composables/useDebouncedRef';
import { computed, ref } from 'vue';

import { useQuery, keepPreviousData } from '@tanstack/vue-query';
import { useVirtualizer, elementScroll } from '@tanstack/vue-virtual'

import CharacterCard from '@/components/CharacterCard.vue';
import SearchBar from '@/components/SearchBar.vue';

import { search_people } from '@/api'
import { Temporal } from 'temporal-polyfill';

import { useRemoteAllSpecies } from '@/api/queries/use_remote_species'
import { useRemoteVehicles } from '@/api/queries/use_remote_vehicles'

const {
  value: search,
  debounced_value: debounced_search
} = useDebouncedRef({ initial_value: '', delay: { milliseconds: 300 } })


const species_query = useRemoteAllSpecies()
const vehicles_query = useRemoteVehicles()

const selected_species = ref<null | string>(null)
const selected_vehicle = ref<null | string>(null)

const TAGS_REGEX = /(#[a-zA-Z0-9_-]+)/g

const tags = computed(() => {
  return search.value.match(TAGS_REGEX)
})

function remove_chip(tag: string) {
  search.value = search.value.replace(new RegExp(`\\s*${tag}`, 'g'), '')
}

const vehicles = computed(() => {
  if (vehicles_query.isError.value) {
    return 'error'
  }
  if (vehicles_query.isPending.value) {
    return 'loading'
  }
  if (vehicles_query.isSuccess.value) {
    return vehicles_query.data.value!.map(_species => _species.name)
  }
  return null

})

const species = computed(() => {
  if (species_query.isError.value) {
    return 'error'
  }
  if (species_query.isPending.value) {
    return 'loading'
  }
  if (species_query.isSuccess.value) {
    return species_query.data.value!.map(_species => _species.name)
  }
  return null
})

const search_query = useQuery({
  queryKey: computed(() => ['swapi', debounced_search.value] as const),
  queryFn: () => search_people({ name: debounced_search.value }),
  enabled: computed(() => debounced_search.value.length > 0),
  placeholderData: keepPreviousData,
  staleTime: Temporal.Duration.from({ hours: 1 }).total('milliseconds'),
})

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
  scrollToFn: elementScroll
}))

const virtualizer = useVirtualizer(virtualizer_options)

const virtual_rows = computed(() => virtualizer.value.getVirtualItems())
const total_size = computed(() => virtualizer.value.getTotalSize())

</script>

<template>
  <main class="responsive">
    <div class="flex justify-center w-full">
      <picture class="relative h-96 block aspect-square">
        <img src="../assets/logo_star_wars.svg" alt="star-wars" class="absolute dark:invert h-full" />
        <img src="../assets/logo_rapihogar.svg" alt="rapihogar" class="absolute dark:invert grayscale
                  h-1/6 right-0 bottom-1/4 z-10 drop-shadow-lg/100 drop-shadow-black -rotate-12">
      </picture>
    </div>
    <div class="w-full flex items-center flex-col">
      <SearchBar v-model:search_query="search" :species="species" :vehicles="vehicles" @search="payload =>
        console.log(payload)" @change="e => {
          selected_species = e.species_filter
          selected_vehicle = e.vehicle_filter
        }
        " />
      <div
        class="overflow-x-auto w-full justify-center mask-radial-[50%_90%] mask-radial-from-80% flex flex-row flex-nowrap">
        <button class="chip" v-for="tag in tags" :key="tag" @click="remove_chip(tag)">
          <span>{{ tag }}</span>
          <i>close</i>
        </button>
      </div>
    </div>

    <div ref="virtual_parent_ref" class="w-full h-96 py-10 overflow-x-auto overflow-y-hidden
      scroll-smooth">
      <!-- SPACER -->
      <div class="md:h-full relative" :style="{ width: `${total_size}px` }">

        <!-- VISIBLE ITEMS -->
        <div class="absolute top-0 left-0 h-full" :style="{
          transform:
            `translateX(${virtual_rows[0]?.start - virtualizer.options.scrollMargin}px)`
        }">

          <!-- ITEMS -->
          <div v-for="virtual_row in virtual_rows" :key="virtual_row?.key" :data-index="virtual_row.index" :ref="el => {
            // @ts-ignore
            virtualizer.measureElement(el)
          }" class="inline-block">
            <div style="padding: 0 10px">
              <div>Column {{ virtual_row.index }}</div>
              <CharacterCard :character_name="characters[virtual_row.index]?.properties.name"
                :gender="characters[virtual_row.index]?.properties.gender" :uid='characters[virtual_row.index]?.uid'
                :query_status="search_query.status.value" />
            </div>
          </div>
        </div>
      </div>
    </div>

  </main>
</template>
