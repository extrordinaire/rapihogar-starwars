<script setup lang="tsx">

const props = withDefaults(defineProps<{
  options: string[] | null | 'loading' | 'error',
  label: string,
  class?: string,
}>(), {
  options: null,
  label: '',
  class: '',
})

const selected_option = defineModel<string | null>('option', { default: '' })

const emit = defineEmits<{
  change: [_selected_option: string]
}>()

</script>

<template>
  <div v-if="props.options === 'error'" :class="`field label relative error suffix border large
    ${props.class}`">
    <select disabled></select>
    <div class="flex w-full h-full absolute top-0 justify-center items-center">
      <i>error</i>
    </div>
    <label>{{ props.label }}</label>
    <i>arrow_drop_down</i>
  </div>

  <div v-else-if="props.options === 'loading'" :class="`field label relative suffix border large
                  animate-pulse ${props.class}`">
    <select disabled></select>
    <div class="flex w-full h-full absolute top-0 justify-center items-center">
      <progress class="circle small !text-gray-100"></progress>
    </div>
    <label>{{ props.label }}</label>
    <i>arrow_drop_down</i>
  </div>

  <div v-else-if="props.options === null" :class="`field label suffix border large ${props.class}`">
    <select disabled>
      <option value="">{{ props.label }}</option>
    </select>
    <i>arrow_drop_down</i>
  </div>

  <div v-else :class="`field label suffix border large ${props.class}`">
    <select v-model="selected_option" @change="emit('change', selected_option!)">
      <option value=""></option>
      <option v-for="option in props.options" :key="option" :value="option">{{ option }}</option>
    </select>
    <label>{{ props.label }}
    </label>
    <i>arrow_drop_down</i>
  </div>
</template>
