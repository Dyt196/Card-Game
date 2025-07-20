<script setup lang="ts">
defineProps<{
  number: string
  suit: string
  color: string
  symbol: string
  hide: boolean
}>()
</script>

<template>
  <div
    :style="`
      aspect-ratio: 1;
      width: 100px;
      border: 0.5px solid gray;
      color: ${color};
      padding: 5px;
      border-radius: 10px;
      background: ${hide ? 'radial-gradient(circle,rgba(2, 44, 250, 1) 19%, rgba(85, 252, 70, 1) 89%)' : 'white'}
    `"
    class="flex flex-col text-xl font-bold"
  >
    <div class="text-left">{{ hide ? '' : suit }}</div>
    <div class="flex-1 text-center content-center">
      {{ hide ? '' : number }} {{ hide ? '' : symbol }}
    </div>
    <div class="text-right">{{ hide ? '' : suit }}</div>
  </div>
</template>
