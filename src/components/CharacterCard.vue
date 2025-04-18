<script setup lang="tsx">
import { get_people } from '@/api';
import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import { Temporal } from 'temporal-polyfill';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

const props = defineProps<{
  character_name: string,
  uid: string,
  gender: string,
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
  queryFn: () => get_people({ uid: props.uid }),
  placeholderData: keepPreviousData,
  staleTime: Temporal.Duration.from({ hours: 1 }).total('milliseconds')
})

const SkeletonData = defineComponent({
  props: {
    class: {
      type: String as PropType<string>,
      required: false,
    }
  },
  render: (props, { slots }) => {
    const random_size = 8 + Math.floor(Math.random() * 8)

    return (
      <>
        {character_query.isLoading.value &&
          <div style={{ width: `${random_size / 3}rem` }} class={`!rounded-xs bg-gray-500 animate-pulse h-4 inline-block ${props.class}`} />}
        {character_query.isError.value &&
          <div style={{ width: `${random_size / 3}rem` }} class={`!rounded-xs bg-gray-500 h-4
          inline-block opacity-30`} />}
        {character_query.isSuccess.value &&
          slots.default()}
      </>
    )

  }
})

</script>

<template>
  <article class="large border">
    <p>{{ props.character_name }}</p>
    <div class="space" />
    <div class="grid w-full gap-2">
      <GenderIcon />
      <p class="s10">
        {{ props.gender }}
      </p>
      <i class="s2 rotate-45">genetics</i>
      <p class="s10">
        <SkeletonData>
          {{ character_query.data.value?.species }}
        </SkeletonData>
      </p>
      <i class="s2">search_hands_free</i>
      <ul class="s10 !px-0">
        <SkeletonData>
          <li v-for="vehicle in character_query.data.value?.vehicles" :key="vehicle">
            {{ vehicle }}
          </li>
        </SkeletonData>
      </ul>
    </div>
  </article>
</template>>
