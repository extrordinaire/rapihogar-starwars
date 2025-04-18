<script setup lang="ts">

import { ref, defineModel, defineProps } from 'vue'

import CustomSelect from './CustomSelect.vue';

const emit = defineEmits<{
  search: [{
    search_query: string,
    vehicle_filter: string | null,
    species_filter: string | null,
  }],
  change: [{
    vehicle_filter: string | null,
    species_filter: string | null,
  }],
}>()

const props = withDefaults(defineProps<{
  vehicles: string[] | 'loading' | 'error' | null,
  species: string[] | 'loading' | 'error' | null,
}>(), {
  vehicles: null,
  species: null
})


const search_query = defineModel<string>('search_query', { default: '' })
const vehicle_filter = ref<string | null>(null)
const species_filter = ref<string | null>(null)

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

</script>


<template>
  <form class="flex flex-row items-center" @submit.prevent="on_submit">
    <div class="field label suffix prefix border left-round large md:w-[30rem]">
      <i>search</i>
      <input v-model.trim="search_query" type="text" tabindex='0' placeholder="Search character"
        class="!w-full !overflow-x-auto" />
    </div>

    <CustomSelect class="w-60 !mt-0" v-model:option="vehicle_filter" :options="props.vehicles" label="Vehicles"
      @change="on_change" />

    <CustomSelect class="w-60 right-round !mt-0" v-model:option="species_filter" :options="props.species"
      label="Species" @change="on_change" />

  </form>

</template>
