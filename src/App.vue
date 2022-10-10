<template>
  <router-view v-if="isRouterAlive" />
</template>

<script setup>
import { provide, ref, nextTick,onMounted,getCurrentInstance } from 'vue'
const {proxy} = getCurrentInstance()
let isRouterAlive = ref(true)
provide('reload', reload)
function reload() {
  isRouterAlive.value = false
  nextTick(() => {
    isRouterAlive.value = true
  })
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app,
#root,
body,
html {
  height: 100%;
  overflow: hidden;
}

body,
html {
  margin: 0;
  overflow: hidden;
}
</style>
