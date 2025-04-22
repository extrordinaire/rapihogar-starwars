import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { get_all_vehicles, get_vehicle } from '..'
import { watch } from 'vue'

function useRemoteVehicles() {
  const query_client = useQueryClient()

  const vehicles_query = useQuery({
    queryKey: ['swapi', 'vehicles'] as const,
    queryFn: get_all_vehicles,
    staleTime: Infinity,
    select: (data) =>
      data.map((entry) => ({
        result: {
          properties: {
            name: entry.name,
            url: entry.url,
          },
          uid: entry.uid,
        },
      })),
  })

  watch(
    () => vehicles_query.data.value,
    (vehicles) => {
      vehicles!.map((vehicle) =>
        query_client.setQueryData(['swapi', 'vehicles', vehicle.result.uid], vehicle),
      )
    },
  )

  return vehicles_query
}

function useRemoteVehicle(params: { uid: string }) {
  const vehicle_query = useQuery({
    queryKey: ['swapi', 'vehicles', params.uid] as const,
    queryFn: () => get_vehicle({ uid: params.uid }),
    staleTime: Infinity,
  })

  console.log('hey', vehicle_query.data.value)

  return vehicle_query
}

export { useRemoteVehicles, useRemoteVehicle }
