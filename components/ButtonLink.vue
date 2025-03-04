<script setup lang="ts">
// A link that is styled like PrimeVue buttons.
import NuxtLink from "#app/components/nuxt-link";
import PButton from "primevue/button";
</script>

<template>
  <PButton :as="NuxtLink">
    <slot />
  </PButton>
</template>

<style scoped>
.p-button:link,
.p-button:active,
.p-button:visited {
  text-decoration: none;
}
</style>
