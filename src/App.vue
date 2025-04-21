<script setup lang="ts">
import type { VNodeRef } from 'vue';
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router'
import { sketch_builder } from './components/background/sketch';

const canvas_parent_ref = ref<VNodeRef>()
const speed_ref = ref(1.0)

sketch_builder({
  parent_ref: canvas_parent_ref.value as unknown as HTMLElement,
  speed_ref: speed_ref
})
</script>

<template>
  <header>

    <nav class="flex flex-row md:visible invisible">
      <img alt="Vue logo" class="tiny" src="@/assets/logo.svg" />
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>

  <div :ref="canvas_parent_ref" class="absolute w-screen h-svh top-0 left-0 -z-10">

  </div>

  <RouterView />
</template>
