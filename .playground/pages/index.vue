<script setup lang="ts">
useHead({
  title: "Nuxt PrimeVue Layer",
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <h2>Nuxt PrimeVue Layer Demo</h2>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <PCard>
        <template #title>Color Scheme Selector</template>
        <template #content>
          The <code>&lt;PrimeVueColorSchemeSelector&gt;</code> component provides a
          button with a dropdown menu to select the theme.

          <p>
            See the <NuxtLink to="colorschemeselector">demo</NuxtLink>.
          </p>
        </template>
      </PCard>

      <PCard>
        <template #title>ButtonLink</template>
        <template #content>
          The <code>&lt;ButtonLink&gt;</code> component provides a link styled
          like a PrimeVue button.

          <p>
            See the <NuxtLink to="buttonlink">demo</NuxtLink>.
          </p>
        </template>
      </PCard>

      <PCard>
        <template #title>Static Message</template>
        <template #content>
          The <code>createStaticMessage()</code> function renders HTML that looks
          like a <code>&lt;PInlineMessage&gt;</code>, but can be used in
          <code>useHeader({ noscript })</code>.

          <p>
            See the <NuxtLink to="staticmessage">demo</NuxtLink>.
          </p>
        </template>
      </PCard>
    </div>
  </div>
</template>
