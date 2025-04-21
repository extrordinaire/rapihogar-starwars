<script setup lang="tsx">
import { get_people } from '@/api';
import { useRemoteSpecies } from '@/api/queries/use_remote_species';
import { useRemoteVehicle } from '@/api/queries/use_remote_vehicles';
import { keepPreviousData, useQuery, type QueryStatus } from '@tanstack/vue-query';
import { Temporal } from 'temporal-polyfill';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

const props = defineProps<{
  query_status: QueryStatus,
  character_name?: string,
  uid?: string,
  gender?: string,
  from_local?: boolean,
}>()

const GenderIcon = defineComponent({
  render: () => (
    <i class="relative s2" >
      <i class="absolute right-0 scale-75 -rotate-12" > male </i>
      <i class="absolute right-1.5 -top-1/4 rotate-45 scale-75" > female </i>
      <i class="absolute rotate-[10deg] -right-1/3 scale-50" > question_mark </i>
    </i>
  )
})

const character_query = useQuery({
  queryKey: ['swapi', `${props.uid}`] as const,
  queryFn: () => get_people({ uid: props.uid! }),
  placeholderData: keepPreviousData,
  staleTime: Temporal.Duration.from({ hours: 1 }).total('milliseconds'),
  enabled: () => !!props.uid,
  select: (data) => ({
    ...data,
    vehicles:
      data.vehicles.map(vehicle_url => useRemoteVehicle({
        uid:
          vehicle_url.replace('https://swapi-api.hbtn.io/api/vehicles/', '')
      })),
    species:
      data.species.map(species_url => useRemoteSpecies({
        uid:
          species_url.replace('https://swapi-api.hbtn.io/api/species/', '')
      }))
  })
})

const SkeletonData = defineComponent({
  props: {
    class: {
      type: String as PropType<string>,
      required: false,
    },
    status: {
      type: String as PropType<QueryStatus>,
      required: true,
      validator: (value: string): boolean =>
        ['pending', 'error', 'success'].includes(value),
    }
  },
  setup: (props, { slots }) => {
    const random_size = 8 + Math.floor(Math.random() * 8)

    return () => (
      <>
        {props.status === 'pending' &&
          <div style={{ width: `${random_size / 3}rem` }} class={`!rounded-xs bg-gray-500
          animate-pulse h-4 inline-block ${props.class}`} />}
        {props.status === 'error' &&
          <div style={{ width: `${random_size / 3}rem` }} class={`!rounded-xs bg-gray-500 h-4
          inline-block opacity-30`} />}
        {props.status === 'success' &&
          slots.default && slots.default()}
      </>
    )

  }
})

</script>

<template>
  <article class="large !h-80 !w-80 border">
    <SkeletonData :status="props.query_status">
      <p>{{ props.character_name }}</p>
    </SkeletonData>
    <div class="space" />
    <div class="grid w-full gap-2">
      <GenderIcon />
      <p class="s10">
        <SkeletonData :status="props.query_status">
          {{ props.gender }}
        </SkeletonData>
      </p>
      <i class="s2 rotate-45">genetics</i>
      <ul class="s10 !px-0 overflow-auto">
        <SkeletonData :status="character_query.status.value">
          <li v-for="species in character_query.data.value?.species" :key="species.result.uid">
            {{ species.result.properties.name }}
          </li>
        </SkeletonData>
      </ul>
      <i class="s2">search_hands_free</i>
      <ul class="s10 !px-0 overflow-auto">
        <SkeletonData :status="character_query.status.value">
          <li v-for="vehicle in character_query.data.value?.vehicles" :key="vehicle.result.uid">
            {{ vehicle.result.properties.name }}
          </li>
        </SkeletonData>
      </ul>
    </div>
  </article>
</template>>
