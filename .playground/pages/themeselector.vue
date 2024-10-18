<script setup lang="ts">
useHead({
  title: "Theme Selector",
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <h2>ThemeSelector</h2>

    <PrimeVueThemeSelector />

    <p>It is a <code>PButton</code>, and can be styled as one:</p>

    <PrimeVueThemeSelector rounded outlined severity="warn" />
  </div>
</template>
