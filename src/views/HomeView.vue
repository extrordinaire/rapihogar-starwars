<script setup lang="ts">
import { useDebouncedRef } from '@/composables/useDebouncedRef';
import { computed, ref } from 'vue';

import { useQuery, keepPreviousData } from '@tanstack/vue-query';

import CharacterCard from '@/components/CharacterCard.vue';
import SearchBar from '@/components/SearchBar.vue';

import { get_all_species, get_all_vehicles, search_people } from '@/api'
import { Temporal } from 'temporal-polyfill';

const {
  value: search,
  debounced_value: debounced_search
} = useDebouncedRef({ initial_value: '', delay: { milliseconds: 300 } })

const selected_species = ref<null | string>(null)
const selected_vehicle = ref<null | string>(null)

const TAGS_REGEX = /(#[a-zA-Z0-9_-]+)/g

const tags = computed(() => {
  return search.value.match(TAGS_REGEX)
})

function remove_chip(tag: string) {
  search.value = search.value.replace(new RegExp(`\\s*${tag}`, 'g'), '')
}

const vehicles_query = useQuery({ queryKey: ["swapi", 'vehicles'], queryFn: get_all_vehicles })
const species_query = useQuery({ queryKey: ['swapi', 'species'], queryFn: get_all_species })

const vehicles = computed(() => {
  if (vehicles_query.isError.value) {
    return 'error'
  }
  if (vehicles_query.isPending.value) {
    return 'loading'
  }
  if (vehicles_query.isSuccess.value) {
    return vehicles_query.data.value?.map(_species => _species.name)
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
    return species_query.data.value?.map(_species => _species.name)
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

    <div class="flex flex-row w-full">
      <CharacterCard v-for="character in search_query.data.value" :key="character.uid"
        :character_name="character.properties.name" :gender="character.properties.gender" :uid='character.uid' />
    </div>



  </main>
</template>
