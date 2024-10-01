<script setup lang="ts">
// A link that is styled like PrimeVue buttons.
import IconSpinner from "primevue/icons/spinner";
import vRipple from "primevue/ripple";
import type { RouteLocationRaw } from "vue-router";

/* eslint-disable vue/require-default-prop */
const props = withDefaults(
  defineProps<{
    to: RouteLocationRaw;

    label?: string;
    icon?: string;
    iconPos?: "left" | "top" | "bottom" | "right";
    iconClass?: string;
    badge?: string;
    badgeClass?: string;
    loading?: boolean;
    loadingIcon?: string;
    severity?: "secondary" | "info" | "success" | "warning" | "help" | "danger";
    size?: "small" | "large";
    link?: boolean;
    outlined?: boolean;
    plain?: boolean;
    raised?: boolean;
    rounded?: boolean;
    text?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
  }>(),
  {
    iconPos: "left",
    disabled: false,
    loading: false,
    link: false,
    plain: false,
    outlined: false,
    raised: false,
    rounded: false,
    text: false,
  },
);
/* eslint-enable vue/require-default-prop */

const SIZE_CLASSES = {
  small: "sm",
  large: "lg",
};

const rootClasses = computed(() => [
  "p-button",
  "p-component",
  props.severity ? "p-button-" + props.severity : undefined,
  props.size ? "p-button-" + SIZE_CLASSES[props.size] : undefined,
  {
    "p-button-loading": props.loading,
    "p-button-link": props.link,
    "p-button-outlined": props.outlined,
    "p-button-plain": props.plain,
    "p-button-raised": props.raised,
    "p-button-rounded": props.rounded,
    "p-button-text": props.text,
    "p-button-loading-label-only": props.loading && !props.icon && props.label,
    "p-button-icon-only": !props.label,
    "p-button-vertical": ["top", "bottom"].includes(props.iconPos) && props.label,
    "p-disabled": props.disabled || props.loading,
  },
]);
const ariaLabel = computed(
  () => props.ariaLabel ?? props.label + (props.badge ? " " + props.badge : ""),
);
</script>

<template>
  <NuxtLink
    v-ripple
    :class="rootClasses"
    :to="to"
    :aria-label="ariaLabel"
    data-pc-name="buttonlink"
    :data-pc-severity="severity"
    :disabled="disabled || loading"
  >
    <slot>
      <slot
        v-if="loading"
        name="loadingicon"
      >
        <i
          v-if="loadingIcon"
          :class="['p-button-loading-icon', 'pi-spin', 'p-button-icon', loadingIcon]"
        />
        <IconSpinner
          v-else
          :class="['p-button-loading-icon', 'pi-spin', 'p-button-icon']"
          spin
        />
      </slot>
      <slot
        v-else
        name="icon"
      >
        <i
          v-if="icon"
          :class="[
            'p-button-icon',
            icon,
            iconClass,
            label ? 'p-button-icon-' + iconPos : undefined,
          ]"
        />
      </slot>
      <span class="p-button-label">{{ label || "&nbsp;" }}</span>
      <PBadge
        v-if="badge"
        :value="badge"
        :class="badgeClass"
      />
    </slot>
  </NuxtLink>
</template>

<style scoped>
.p-button:link {
  text-decoration: none;
}
</style>
