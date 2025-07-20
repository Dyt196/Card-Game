<script setup lang="ts">
import { RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="flex flex-col" style="width: 100vw; max-width: 100vw">
    <div class="flex-1" style="width: 100%; max-width: 100%">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
