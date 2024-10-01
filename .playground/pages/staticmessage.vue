<script setup lang="ts">
useHead({
  title: "Static Message",
  noscript: [
    createStaticMessage({ message: 'This is a demo of static message in noscript', severity: 'success' }),
  ],
});
</script>

<template>
  <div class="flex flex-column gap-4">
    <h2>Static Message</h2>

    <div v-html="createStaticMessage({ message: 'Hello World, severity:info!', severity: 'info' })" />
    <div v-html="createStaticMessage({ message: 'Hello World, severity:success!', severity: 'success' })" />
    <div v-html="createStaticMessage({ message: 'Hello World, severity:warn!', severity: 'warn' })" />
    <div v-html="createStaticMessage({ message: 'Hello World, severity:error!', severity: 'error' })" />
  </div>
</template>
