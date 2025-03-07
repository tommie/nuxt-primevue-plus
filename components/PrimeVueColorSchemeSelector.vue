<script lang="ts">
interface ThemeItem {
  label: string;
  icon: string;
}

export function usePrimeVueThemes() {
  const appConfig = useAppConfig();
  const colorSchemes = appConfig.primevueTheme.colorSchemes;
  const theme = usePrimeVueTheme();

  return {
    colorSchemes,
    theme,
    menuItems: computed(() =>
      Object.entries(colorSchemes).map(([name, { label, icon }]) => ({
        key: name,
        label,
        icon,
        command: () => {
          theme.colorScheme.preferred = name;
        },
        selected: theme.colorScheme.preferred === name,
      })),
    ),
  };
}
</script>

<script lang="ts" setup>
// Provides a button to switch between color schemes.
import PButton from "primevue/button";
import PMenu from "primevue/menu";
import { useId } from "vue";

const { colorSchemes, theme, menuItems } = usePrimeVueThemes();
const menuID = useId();

const menuEl = ref();
function onClickButton(event: UIEvent) {
  menuEl.value.toggle(event);
}
</script>

<template>
  <div>
    <PButton
      v-bind="$attrs"
      aria-haspopup="true"
      :aria-controls="menuID"
      aria-label="Open the color scheme menu"
      title="Color Scheme Menu"
      @click="onClickButton"
    >
      <template #icon="props">
        <span class="inline-flex relative">
          <span
            v-bind="props"
            :class="colorSchemes[theme.colorScheme.resolved].icon"
          />
          <span
            v-if="theme.colorScheme.preferred === 'system'"
            :class="colorSchemes.system.icon"
            :style="{
              position: 'absolute',
              'font-size': 'xx-small',
              bottom: '-.9ex',
              right: '-1ex',
            }"
          />
        </span>
      </template>
    </PButton>
    <PMenu
      :id="menuID"
      ref="menuEl"
      :model="menuItems"
      :popup="true"
    >
    </PMenu>
  </div>
</template>
