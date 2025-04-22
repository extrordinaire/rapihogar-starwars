<script setup lang="tsx">
import { useRemoteCharacter } from '@/api/queries/use_remote_characters'
import { useUserPreferencesStore } from '@/stores/user_preferences';
import { type QueryStatus } from '@tanstack/vue-query'
import type { PropType } from 'vue'
import { computed, defineComponent, toRef } from 'vue'

const props = defineProps<{
  query_status: QueryStatus
  character_name?: string
  uid?: string
  gender?: string
}>()

const GenderIcon = defineComponent({
  render: () => (
    <i class="relative s2">
      <i class="absolute right-0 scale-75 -rotate-12"> male </i>
      <i class="absolute right-1.5 -top-1/4 rotate-45 scale-75"> female </i>
      <i class="absolute rotate-[10deg] -right-1/3 scale-50"> question_mark </i>
    </i>
  ),
})
const uid_ref = toRef(props, 'uid')

const user_preferences = useUserPreferencesStore()

const is_favorite = computed({
  get: () => user_preferences.liked_characters_uid.includes(uid_ref.value!), 
  set: (val:boolean) => {
    if(val)
    {
      user_preferences.like_character({uid: uid_ref.value!}) 
    } 
    else {
     user_preferences.unlike_character({uid: uid_ref.value!})}
    }
})

const { character_query, species_queries, vehicle_queries } = useRemoteCharacter({ uid: uid_ref })

const SkeletonData = defineComponent({
  props: {
    class: {
      type: String as PropType<string>,
      required: false,
    },
    status: {
      type: String as PropType<QueryStatus>,
      required: true,
      validator: (value: string): boolean => ['pending', 'error', 'success'].includes(value),
    },
  },
  setup: (props, { slots }) => {
    const random_size = 8 + Math.floor(Math.random() * 8)

    return () => (
      <>
        {props.status === 'pending' && (
          <div
            style={{ width: `${random_size / 3}rem` }}
            class={`!rounded-xs bg-gray-500
          animate-pulse h-4 inline-block ${props.class}`}
          />
        )}
        {props.status === 'error' && (
          <div
            style={{ width: `${random_size / 3}rem` }}
            class={`!rounded-xs bg-gray-500 h-4
          inline-block opacity-30`}
          />
        )}
        {props.status === 'success' && slots.default && slots.default()}
      </>
    )
  },
})
</script>

<template>
  <article class="large !h-80 !w-80 border">
    <div class="flex flex-row justify-between">
      <SkeletonData :status="props.query_status">
        <p>{{ props.character_name }}</p>
      </SkeletonData>
      <button class="circle transparent ripple" @click="(el) => (is_favorite = !is_favorite)">
        <i
          :class="{
            'red-text': is_favorite,
            fill: is_favorite,
            default: !is_favorite,
            'fill-none': !is_favorite,
          }"
          >favorite</i
        >
      </button>
    </div>
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
          <SkeletonData
            v-for="species_query in species_queries"
            :key="species_query.data?.result.uid"
            :status="species_query.status"
          >
            <li>
              {{ species_query.data!.result.properties.name }}
            </li>
          </SkeletonData>
        </SkeletonData>
      </ul>
      <i class="s2">search_hands_free</i>
      <ul class="s10 !px-0 overflow-auto">
        <SkeletonData :status="character_query.status.value">
          <SkeletonData
            v-for="vehicle_query in vehicle_queries"
            :status="vehicle_query.status"
            :key="vehicle_query.data?.result.uid"
          >
            <li>
              {{ vehicle_query.data!.result.properties.name }}
            </li>
          </SkeletonData>
        </SkeletonData>
      </ul>
    </div>
  </article>
</template>
