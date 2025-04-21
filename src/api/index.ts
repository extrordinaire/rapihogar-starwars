
import wretch from 'wretch'
import type { z } from '@zod/mini'
import { queryStringAddon } from 'wretch/addons'

import { SCHEMA_SWAPI_LIST_RESPONSE, type T_SWAPI_VEHICLE, type T_SWAPI_SPECIES_REDUCED, SCHEMA_SWAPI_SPECIES_REDUCED, type T_SWAPI_VEHICLE_REDUCED, SCHEMA_SWAPI_VEHICLE_REDUCED, type T_SWAPI_PEOPLE, type T_SWAPI_PEOPLE_REDUCED, SCHEMA_SWAPI_PEOPLE_REDUCED, SCHEMA_SWAPI_SEARCH_RESPONSE, SCHEMA_SWAPI_PEOPLE, type T_SWAPI_PEOPLE_SEARCH, SCHEMA_SWAPI_PEOPLE_SEARCH, SCHEMA_SWAPI_VEHICLE, SCHEMA_SWAPI_SPECIES, type T_SWAPI_SPECIES } from './schemas.ts'


type T_UNWRAP<T> = {
  success: T,
  error: null
} | { success: null, error: Error }

async function unwrap<T>(promise: Promise<T>): Promise<T_UNWRAP<T>> {
  try {
    return { success: await promise, error: null }
  } catch (error) {
    return { error: error instanceof Error ? error : new Error('Unknown error'), success: null }
  }
}

const api = wretch(
  'https://www.swapi.tech/api', // Parece que está deprecada, no devuelve informacion completa con
  //con requests a recursos específicos imposibilitando completar el desafío.
  //'https://swapi-api.hbtn.io/api',
  {
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .addon(queryStringAddon)
  .errorType('json')
  .resolve(r => r.json())


const chara_api = wretch(
  'https://swapi-api.hbtn.io/api',
  {
    mode: 'cors',
    headers: {
      "Content-Type": "application/json"
    }
  })
  .addon(queryStringAddon)
  .errorType('json')
  .resolve(r => r.json())

export async function get_all_pages<T>(path: string, schema: z.ZodMiniType) {
  let all_items: T[] = []
  let next: string | null = path

  while (next) {
    const { success: fetching_success, error: fetching_error } = await unwrap<unknown>(api.get(next))

    if (fetching_error) {
      console.error('get_all_pages', 'path', fetching_error)
      throw fetching_error
    }


    const { data: list_data, error: parsing_error } =
      SCHEMA_SWAPI_LIST_RESPONSE(schema).safeParse(fetching_success)

    if (parsing_error) {
      console.error('get_all_pages', 'path', 'parse', parsing_error, fetching_success)
      throw fetching_error
    }

    if (list_data) {
      next = list_data.next?.replace('https://www.swapi.tech/api', '') || null
      all_items = [...all_items, ...list_data.results as T[]]
    }


  }

  return all_items
}

export async function get_all_vehicles(): Promise<T_SWAPI_VEHICLE_REDUCED[]> {
  const all_vehicles = await get_all_pages<T_SWAPI_VEHICLE_REDUCED>('/vehicles', SCHEMA_SWAPI_VEHICLE_REDUCED)
  return all_vehicles
}

export async function get_all_species(): Promise<T_SWAPI_SPECIES_REDUCED[]> {
  const all_species = await get_all_pages<T_SWAPI_SPECIES_REDUCED>('/species', SCHEMA_SWAPI_SPECIES_REDUCED)
  return all_species
}

export async function get_all_people(): Promise<T_SWAPI_PEOPLE_REDUCED[]> {
  const all_people = await get_all_pages<T_SWAPI_PEOPLE_REDUCED>('/people', SCHEMA_SWAPI_PEOPLE_REDUCED)
  return all_people
}

export async function search_people(params: { name: string }): Promise<T_SWAPI_PEOPLE_SEARCH[]> {
  let people: T_SWAPI_PEOPLE_SEARCH[] = []

  const { success: fetching_success, error: fetching_error } =
    await unwrap(api.query({ name: params.name }).get('/people/'))

  if (fetching_error) {
    console.error('search_people', fetching_error)
    throw fetching_error
  }

  const { data: people_list, error: parsing_error } =
    SCHEMA_SWAPI_SEARCH_RESPONSE(SCHEMA_SWAPI_PEOPLE_SEARCH).safeParse(fetching_success)

  if (parsing_error) {
    console.error(parsing_error, fetching_success)
    throw parsing_error
  }

  people = [...people_list.result]

  return people
}

export async function get_vehicle(params: { uid: string }): Promise<T_SWAPI_VEHICLE> {
  const { success: fetching_success, error: fetching_error } =
    await unwrap(api.get(`/vehicles/${params.uid}`))

  if (fetching_error) {
    console.error(fetching_error)
    throw fetching_error
  }

  const { data: vehicle_data, error: parsing_error } =
    SCHEMA_SWAPI_VEHICLE.safeParse(fetching_success)

  if (parsing_error) {
    console.error(parsing_error, fetching_success)
    throw parsing_error
  }

  return vehicle_data
}

export async function get_species(params: { uid: string }): Promise<T_SWAPI_SPECIES> {
  const { success: fetching_success, error: fetching_error } =
    await unwrap(api.get(`/species/${params?.uid}`))

  if (fetching_error) {
    console.error(fetching_error)
    throw fetching_error
  }

  const { data: species_data, error: parsing_error } =
    SCHEMA_SWAPI_SPECIES.safeParse(fetching_success)

  if (parsing_error) {
    console.error(parsing_error, fetching_success)
    throw parsing_error
  }

  return species_data
}

export async function get_people(params: { uid: string }) {
  const { success: fetching_success, error: fetching_error } =
    await unwrap(chara_api.get(`/people/${params.uid}`))

  if (fetching_error) {
    console.error(fetching_error)
    throw fetching_error
  }

  const { data: people_data, error: parsing_error } =
    SCHEMA_SWAPI_PEOPLE.safeParse(fetching_success)

  if (parsing_error) {
    console.error(parsing_error, fetching_success)
    throw parsing_error
  }


  const people = {
    ...people_data,
  }

  return people
}

