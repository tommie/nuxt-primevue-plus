<script lang="ts" setup>
// Provides a toggle to switch between color schemes.
import PSelectButton from "primevue/selectbutton";
import { useId } from "vue";

import { usePrimeVueThemes } from "./PrimeVueColorSchemeSelector.vue";

const { colorSchemes, theme, menuItems } = usePrimeVueThemes();
</script>

<template>
  <PSelectButton
    v-model="theme.colorScheme.preferred"
    :options="menuItems"
    option-label="label"
    option-value="key"
    aria-label="Select the color scheme"
  >
    <template #option="slotProps">
      <span
        class="relative"
        :title="slotProps.option.label"
      >
        <i :class="slotProps.option.icon" />
        <ClientOnly>
          <span
            v-if="slotProps.option.key === 'system'"
            :class="colorSchemes[theme.resolveSystem()].icon"
            :style="{
              position: 'absolute',
              'font-size': 'xx-small',
              top: '-.75ex',
              right: '-.75ex',
            }"
          />
        </ClientOnly>
      </span>
    </template>
  </PSelectButton>
</template>
