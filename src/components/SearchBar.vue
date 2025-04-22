<script setup lang="ts">

import { defineModel, computed } from 'vue'

import CustomSelect from './CustomSelect.vue';
import { useRemoteAllSpecies } from '@/api/queries/use_remote_species';
import { useRemoteVehicles } from '@/api/queries/use_remote_vehicles';
import { useUserPreferencesStore } from '@/stores/user_preferences';

const emit = defineEmits<{
  search: [{
    search_query: string,
    vehicle_filter: [string,string] | [null, ''],
    species_filter: [string,string] | [null, ''],
  }],
  change: [{
    vehicle_filter: [string,string] | [null, ''],
    species_filter: [string,string] | [null, ''],
  }],
}>()

const user_preferences = useUserPreferencesStore()

const search_query = defineModel<string>('search_query', { default: '' })

const vehicle_filter = computed<[string,string] | [null,'']>({
  get: () => user_preferences.selected_vehicles,
  set: (selected) => user_preferences.selected_vehicles = selected
})
const vehicle_filter_string = computed<string | null>({
  get: () => user_preferences.selected_vehicles[0],
  set: (val) => user_preferences.selected_vehicles = vehicles_options.value.find(([uid,]) => uid === val) ?? [null,'']
})

const species_filter = computed<[string,string] | [null,'']>({
  get: () => user_preferences.selected_species,
  set: (selected) => user_preferences.selected_species = selected
})
const species_filter_string = computed<string | null>({
  get: () => user_preferences.selected_species[0],
  set: (val) => {
    console.log(val,vehicles_options.value.find(([uid,]) => uid === val))
    user_preferences.selected_species = vehicles_options.value.find(([uid,]) => uid === val) ?? [null,'']
  }
})

const vehicles_query = useRemoteAllSpecies()
const species_query = useRemoteVehicles()

function on_submit() {
  emit("search", {
    search_query: search_query.value || '',
    vehicle_filter: vehicle_filter.value,
    species_filter: species_filter.value
  })
}

function on_change() {
  emit('change', {
    vehicle_filter: vehicle_filter.value,
    species_filter: species_filter.value
  })
}

const vehicles_options = computed(()=> [
  ...(vehicles_query.data.value?.map(
    vehicles => [vehicles.result.uid, vehicles.result.properties.name] as [string, string]
  ) ?? []),
  ...(user_preferences.selected_vehicles[0] !== null ? [user_preferences.selected_vehicles] : [])
]);

const species_options = computed(()=> [
  ...(species_query.data.value?.map(
    species => [species.result.uid, species.result.properties.name] as [string, string]
  ) ?? []),
  ...(user_preferences.selected_species[0] !== null ? [user_preferences.selected_species] : [])
]);

</script>


<template>
  <form class="flex flex-row items-center" @submit.prevent="on_submit">
    <div class="field label suffix prefix border left-round large md:w-[30rem]">
      <i>search</i>
      <input v-model.trim="search_query" type="text" tabindex='0' placeholder="Search character"
        class="!w-full !overflow-x-auto" />
    </div>

    <CustomSelect class="w-60 !mt-0" v-model:option="vehicle_filter_string" :status="vehicles_query.status.value" 
    :options="vehicles_options" label="Vehicles"
      @change="on_change" />

    <CustomSelect class="w-60 right-round !mt-0" v-model:option="species_filter_string" :status="species_query.status.value" :options="species_options"
      label="Species" @change="on_change" />

  </form>

</template>
