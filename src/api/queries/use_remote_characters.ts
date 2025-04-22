import { keepPreviousData, useQueries, useQuery } from '@tanstack/vue-query'
import { get_people, get_species, get_vehicle } from '..'
import { Temporal } from 'temporal-polyfill'
import { computed, isRef, type Ref } from 'vue'
import type { T_SWAPI_PEOPLE } from '../schemas'

export function useSearchCharacters(params: { name: string }) {}

export function useRemoteCharacter(params: { uid: Ref<string | undefined> } | { uid: string }) {
  const uid = computed(() => (isRef(params.uid) ? params.uid.value : params.uid))

  const character_query = useQuery({
    queryKey: computed(() => ['swapi', 'people', `${params.uid}`] as const),
    queryFn: () => get_people({ uid: uid.value || '' }),
    placeholderData: keepPreviousData,
    staleTime: Temporal.Duration.from({ hours: 1 }).total('milliseconds'),
    enabled: computed(() => !!uid.value),
    select: (data) => ({
      ...data,
      vehicles: data.vehicles.map((url) =>
        url
          .replace('https://swapi-api.hbtn.io/api/vehicles/', '')
          .match(/[0-9]*/)!
          .join(''),
      ),
      species: data.species.map((url) =>
        url
          .replace('https://swapi-api.hbtn.io/api/species/', '')
          .match(/[0-9]*/)!
          .join(''),
      ),
    }),
  })

  const vehicle_queries = useQueries({
    queries: computed(() =>
      (character_query.data.value?.vehicles ?? []).map((uid) => ({
        queryKey: ['swapi', 'vehicles', uid] as const,
        queryFn: () => get_vehicle({ uid }),
        staleTime: Infinity,
        enabled: () => (character_query.data.value?.vehicles.length ?? 0) > 0,
      })),
    ),
  })

  const species_queries = useQueries({
    queries: computed(() =>
      (character_query.data.value?.species ?? []).map((uid) => ({
        queryKey: ['swapi', 'species', uid] as const,
        queryFn: () => get_species({ uid }),
        staleTime: Infinity,
        enabled: () => (character_query.data.value?.species.length ?? 0) > 0,
      })),
    ),
  })

  return { character_query, species_queries, vehicle_queries }
}
