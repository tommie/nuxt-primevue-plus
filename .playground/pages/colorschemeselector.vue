<script setup lang="ts">
useHead({
  title: "Color Scheme Selector",
});
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <h2 class="text-2xl mb-6">ColorSchemeSelector</h2>

    <PrimeVueColorSchemeSelector />

    <p>It is a <code>PButton</code>, and can be styled as one:</p>

    <PrimeVueColorSchemeSelector
      rounded
      outlined
      severity="warn"
    />

    <PrimeVueColorSchemeSelector
      rounded
      outlined
      severity="warn"
      size="small"
    />

    <PrimeVueColorSchemeSelector
      rounded
      outlined
      severity="warn"
      label="Colors"
    />

    <PrimeVueColorSchemeToggle />

    <PrimeVueColorSchemeToggle size="small" />
  </div>
</template>
