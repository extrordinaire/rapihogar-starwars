import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { get_all_vehicles, get_vehicle } from "..";
import { watch } from "vue";


function useRemoteVehicles() {
  const query_client = useQueryClient()

  const vehicles_query = useQuery({
    queryKey: ["swapi", 'vehicles'],
    queryFn: get_all_vehicles,
    staleTime: Infinity
  })

  watch(
    () => vehicles_query.data.value,
    (vehicles) => {
      vehicles.map(vehicle =>
        query_client.setQueryData(['swapi', 'vehicles', vehicle.uid], vehicle))
    })

  return vehicles_query
}

function useRemoteVehicle(params: { uid: string }) {
  const query_client = useQueryClient()

  const vehicle_query = useQuery({
    queryKey: ['swapi', 'vehicles', params.uid],
    queryFn: () => get_vehicle({ uid: params.uid }),
    staleTime: Infinity,
  })

  return vehicle_query
}

export { useRemoteVehicles, useRemoteVehicle }

