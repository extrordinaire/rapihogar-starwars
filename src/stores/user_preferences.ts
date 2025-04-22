import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { T_SWAPI_PEOPLE } from '@/api/schemas'

export const useUserPreferencesStore = defineStore(
  'user_preferences',
  () => {
    const liked_characters_uid = ref<string[]>([])
    const search_query = ref<string>('')
    const selected_species = ref<[string, string] | [null, '']>([null, ''])
    const selected_vehicles = ref<[string, string] | [null, '']>([null, ''])

    function like_character(params: { uid: string }) {
      if (
        !liked_characters_uid.value.find(
          (liked_character_uid) => liked_character_uid === params.uid,
        )
      ) {
        liked_characters_uid.value.push(params.uid)
      }
    }

    function unlike_character(params: { uid: string }) {
      liked_characters_uid.value = liked_characters_uid.value.filter(
        (like_character_uid) => like_character_uid !== params.uid,
      )
    }

    return {
      liked_characters_uid: liked_characters_uid,
      like_character: like_character,
      unlike_character: unlike_character,
      search_query: search_query,
      selected_species: selected_species,
      selected_vehicles: selected_vehicles,
    }
  },
  { persist: true },
)
