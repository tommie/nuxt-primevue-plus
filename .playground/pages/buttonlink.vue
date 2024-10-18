<script setup lang="ts">
useHead({
  title: "ButtonLink",
});

const VARIANTS = [
  [
    "Label and Icon",
    [{ label: "Label" }, { icon: "pi pi-user" }, { label: "Icon", icon: "pi pi-user" }],
  ],
  [
    "Icon",
    [
      { label: "Icon Bottom", icon: "pi pi-user", iconPos: "bottom" },
      { label: "Icon Top", icon: "pi pi-user", iconPos: "top" },
      { label: "Icon Right", icon: "pi pi-user", iconPos: "right" },
      { label: "Icon Class", icon: "pi pi-user", iconClass: "text-red-600" },
    ],
  ],
  [
    "Badge",
    [
      { label: "Badge", badge: "B" },
      { label: "BadgeClass", badge: "B", badgeClass: "text-red-100" },
    ],
  ],
  [
    "Loading",
    [
      { label: "Loading", loading: true },
      { label: "Loading Icon", loading: true, loadingIcon: "pi pi-times" },
    ],
  ],
  [
    "Severity",
    [
      { label: "Secondary", severity: "secondary" },
      { label: "Info", severity: "info" },
      { label: "Success", severity: "success" },
      { label: "Warning", severity: "warning" },
      { label: "Help", severity: "help" },
      { label: "Danger", severity: "danger" },
    ],
  ],
  [
    "Size",
    [
      { label: "Large", size: "large" },
      { label: "Small", size: "small" },
    ],
  ],
  [
    "Style",
    [
      { label: "Link", link: true },
      { label: "Outlined", outlined: true },
      { label: "Plain", plain: true },
      { label: "Raised", raised: true },
      { label: "Text", text: true },
    ],
  ],
  [
    "Rounded",
    [
      { label: "Link", link: true, rounded: true },
      { label: "Outlined", outlined: true, rounded: true },
      { label: "Plain", plain: true, rounded: true },
      { label: "Raised", raised: true, rounded: true },
      { label: "Text", text: true, rounded: true },
    ],
  ],
  [
    "State",
    [
      { label: "Disabled", disabled: true },
      { label: "Aria Label", ariaLabel: "Aria Label" },
    ],
  ],
];
</script>

<template>
  <div>
    <h2>ButtonLink</h2>

    <PCard
      v-for="[title, vars] in VARIANTS"
      :key="String(title)"
      class="my-4"
    >
      <template #title>{{ title }}</template>
      <template #content>
        <div
          v-for="(v, index) in vars"
          :key="index"
          class="flex flex-col items-center"
        >
          <ButtonLink
            to="/"
            v-bind="v"
          />
          <div class="mt-3">
            <code>{{
                    Object.entries(v)
                    .map(([k, v]) => `${k}="${v}"`)
                    .join(" ")
                  }}</code>
          </div>
        </div>
      </template>
    </PCard>
  </div>
</template>
