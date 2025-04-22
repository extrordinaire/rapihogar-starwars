<script setup lang="tsx">
import type { QueryStatus } from '@tanstack/vue-query';


const props = withDefaults(defineProps<{
  status: QueryStatus,
  options: [uid:string,value:string][],
  label: string,
  class?: string,
}>(), {
  status: 'pending',
  label: '',
  class: '',
})

const selected_option = defineModel<string | null>('option', { default: '' })

const emit = defineEmits<{
  change: [_selected_option: string]
}>()

</script>

<template>
  <div v-if="status === 'error'" :class="`field label relative error suffix border large
    ${props.class}`">
    <select disabled></select>
    <div class="flex w-full h-full absolute top-0 justify-center items-center">
      <i>error</i>
    </div>
    <label>{{ props.label }}</label>
    <i>arrow_drop_down</i>
  </div>

  <div v-else-if="status === 'pending'" :class="`field label relative suffix border large
                  animate-pulse ${props.class}`">
    <select disabled></select>
    <div class="flex w-full h-full absolute top-0 justify-center items-center">
      <progress class="circle small !text-gray-100"></progress>
    </div>
    <label>{{ props.label }}</label>
    <i>arrow_drop_down</i>
  </div>

  <div v-else-if="props.options.length === 0" :class="`field label suffix border large ${props.class}`">
    <select disabled>
      <option value="">{{ props.label }}</option>
    </select>
    <i>arrow_drop_down</i>
  </div>

  <div v-else :class="`field label suffix border large ${props.class}`">
    <select v-model="selected_option" @change="emit('change', selected_option!)">
      <option value=""></option>
      <option v-for="[uid,value] in props.options" :key="uid" :value="uid">{{ value }}</option>
    </select>
    <label>{{ props.label }}
    </label>
    <i>arrow_drop_down</i>
  </div>
</template>
