<script lang="ts" setup>
// Provides a button to switch between color schemes.

const { themes, theme, menuItems } = usePrimeVueThemes();

function iconForTheme(theme: Theme) {
  return themes.value[theme].icon;
}

const menuEl = ref();
function onClickButton(event: UIEvent) {
  menuEl.value.toggle(event);
}
</script>

<script lang="ts">
import type { Theme } from "../composables/primevuetheme";

interface ThemeItem {
  label: string;
  icon: string;
}

export function usePrimeVueThemes() {
  const appConfig = useAppConfig();
  const themes = computed(
    () =>
      ({
        system: {
          label: "System",
          icon: "pi pi-file",
        },
        ...Object.fromEntries(
          Object.entries(appConfig.primevueTheme.themes).map(([name, { label, icon }]) => [
            name,
            {
              label,
              icon,
            },
          ]),
        ),
      }) as Record<Theme, ThemeItem>,
  );
  const theme = usePrimeVueTheme();

  return {
    themes,
    theme,
    menuItems: computed(() =>
      Object.entries(themes.value).map(([name, data]) => ({
        key: name,
        label: data.label,
        icon: data.icon,
        command: () => {
          theme.preferred.value = name;
        },
        selected: theme.preferred.value === name,
      })),
    ),
  };
}
</script>

<template>
  <div>
    <PButton
      :icon="iconForTheme(theme.resolved.value)"
      aria-haspopup="true"
      aria-controls="theme-menu"
      text
      rounded
      size="small"
      aria-label="Open the color theme menu"
      title="Color Theme Menu"
      @click="onClickButton"
    />
    <PMenu
      id="theme-menu"
      ref="menuEl"
      :model="menuItems"
      :popup="true"
    >
      <template #item="slotProps">
        <div :class="['p-menuitem-link', { selected: slotProps.item.selected }]">
          <i :class="['p-menuitem-icon', slotProps.item.icon]" />
          <span class="p-menuitem-text">{{ slotProps.item.label }}</span>
        </div>
      </template>
    </PMenu>
  </div>
</template>

<style scoped>
.selected {
  background-color: var(--highlight-bg);
  color: var(--highlight-text-color);
}
</style>
