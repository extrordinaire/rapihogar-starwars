import { map, z } from "@zod/mini"

// SCHEMA_SWAPI_PEOPLE
export const SCHEMA_SWAPI_PEOPLE = z.object({
  birth_year: z.string(),
  eye_color: z.string(),
  gender: z.string(),
  hair_color: z.string(),
  height: z.string(),
  mass: z.string(),
  skin_color: z.string(),
  homeworld: z.string(),
  films: z.nullish(z.array(z.string())),
  species: z.array(z.string()),
  starships: z.array(z.string()),
  vehicles: z.array(z.string()),
  url: z.string(),
  created: z.string(),
  edited: z.string(),
  name: z.string(),
});
export type T_SWAPI_PEOPLE = z.infer<typeof SCHEMA_SWAPI_PEOPLE>;

export const SCHEMA_SWAPI_PEOPLE_SEARCH = z.object({
  properties: z.object({
    name: z.string(),
    birth_year: z.string(),
    eye_color: z.string(),
    gender: z.string(),
    hair_color: z.string(),
    height: z.string(),
    mass: z.string(),
    skin_color: z.string(),
    homeworld: z.string(),
    url: z.string(),
    created: z.string(),
    edited: z.string(),
  }),
  "_id": z.string(),
  description: z.string(),
  uid: z.string(),
  "__v": z.number(),
});
export type T_SWAPI_PEOPLE_SEARCH = z.infer<typeof SCHEMA_SWAPI_PEOPLE_SEARCH>;


export const SCHEMA_SWAPI_PEOPLE_REDUCED = z.object({
  name: z.string(),
  url: z.string(),
  uid: z.string()
});
export type T_SWAPI_PEOPLE_REDUCED = z.infer<typeof SCHEMA_SWAPI_PEOPLE_REDUCED>;

// SCHEMA_SWAPI_VEHICLE
export const SCHEMA_SWAPI_VEHICLE = z.object({
  result: z.object({
    properties: z.object({
      name: z.string(),
      model: z.string(),
      vehicle_class: z.string(),
      manufacturer: z.string(),
      length: z.string(),
      cost_in_credits: z.string(),
      crew: z.string(),
      passengers: z.string(),
      max_atmosphering_speed: z.string(),
      cargo_capacity: z.string(),
      consumables: z.nullable(z.string()),
      films: z.array(z.string()),
      pilots: z.array(z.string()),
      url: z.string(),
      created: z.string(),
      edited: z.string(),
    }),
    "_id": z.string(),
    description: z.string(),
    uid: z.string(),
    "__v": z.number(),
  }),
  message: z.string(),
  apiVersion: z.string(),
  timestamp: z.string(),
  social: z.record(z.string(), z.string()),
  support: z.any(),
});
export type T_SWAPI_VEHICLE = z.infer<typeof SCHEMA_SWAPI_VEHICLE>;

export const SCHEMA_SWAPI_VEHICLE_REDUCED = z.object({
  name: z.string(),
  url: z.string(),
  uid: z.string(),
});
export type T_SWAPI_VEHICLE_REDUCED = z.infer<typeof SCHEMA_SWAPI_VEHICLE_REDUCED>;

// SCHEMA_SWAPI_SPECIES
export const SCHEMA_SWAPI_SPECIES = z.object({
  result: z.object({
    properties: z.object({
      name: z.string(),
      classification: z.string(),
      designation: z.string(),
      average_height: z.string(),
      average_lifespan: z.string(),
      eye_colors: z.string(),
      hair_colors: z.string(),
      skin_colors: z.string(),
      language: z.string(),
      homeworld: z.string(),
      people: z.array(z.string()),
      films: z.optional(z.array(z.string())),
      url: z.string(),
      created: z.string(),
      edited: z.string(),
    }),
    "_id": z.string(),
    description: z.string(),
    uid: z.string(),
    "__v": z.number(),
  }),
  message: z.string(),
  apiVersion: z.string(),
  timestamp: z.string(),
  social: z.record(z.string(), z.string()),
  support: z.any(),
});
export type T_SWAPI_SPECIES = z.infer<typeof SCHEMA_SWAPI_SPECIES>;

// SCHEMA_SWAPI_SPECIES
export const SCHEMA_SWAPI_SPECIES_REDUCED = z.object({
  name: z.string(),
  url: z.string(),
  uid: z.string(),
});
export type T_SWAPI_SPECIES_REDUCED = z.infer<typeof SCHEMA_SWAPI_SPECIES_REDUCED>;

// SCHEMA_SWAPI_LIST_RESPONSE
export const SCHEMA_SWAPI_LIST_RESPONSE = <T>(itemSchema: z.ZodMiniType<T, T>) =>
  z.object({
    next: z.nullable(z.string()),
    previous: z.nullable(z.string()),
    message: z.string(),
    total_records: z.number(),
    total_pages: z.number(),
    apiVersion: z.string(),
    timestamp: z.string(),
    support: z.any(),
    social: z.record(z.string(), z.string()),
    results: z.array(itemSchema),
  });
export type T_SWAPI_LIST_RESPONSE<T> = z.infer<ReturnType<typeof SCHEMA_SWAPI_LIST_RESPONSE<T>>>;


// SCHEMA_SWAPI_SEARCH_RESPONSE
export const SCHEMA_SWAPI_SEARCH_RESPONSE = <T>(itemSchema: z.ZodMiniType<T, T>) => z.object({
  apiVersion: z.string(),
  timestamp: z.string(),
  result: z.array(itemSchema),
  social: z.record(z.string(), z.string()),
  support: z.any(),
  message: z.string()
})
export type T_SWAPI_SEARCH_RESPONSE<T> = z.infer<ReturnType<typeof SCHEMA_SWAPI_SEARCH_RESPONSE<T>>>
