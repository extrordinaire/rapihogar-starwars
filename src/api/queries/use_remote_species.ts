import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { get_all_species, get_species } from "..";
import { watch } from "vue";

function useRemoteAllSpecies() {
  const query_client = useQueryClient()

  const remote_species_query = useQuery({
    queryKey: ['swapi', 'species'],
    queryFn: get_all_species,
    staleTime: Infinity,
    select: (data) => data.map(entry => ({
      result: {
        properties: {
          name: entry.name,
          url: entry.url
        },
        uid: entry.uid
      }
    }))
  })

  watch(
    () => remote_species_query.data.value,
    (species) => {
      species?.map(_species =>
        query_client.setQueryData(['swapi', 'species', _species.result.uid], _species))
    })

  return remote_species_query
}

function useRemoteSpecies(params: { uid: string }) {
  const remote_species_query = useQuery({
    queryKey: ['swapi', 'species', params.uid],
    queryFn: () => get_species({ uid: params.uid }),
    staleTime: Infinity
  })

  return remote_species_query
}

export { useRemoteAllSpecies, useRemoteSpecies }




