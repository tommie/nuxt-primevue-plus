import {
  addComponentsDir,
  addImports,
  createResolver,
  defineNuxtModule,
  resolvePath,
} from "@nuxt/kit";

export default defineNuxtModule({
  async setup() {
    const resolver = createResolver(import.meta.url);

    await addComponentsDir({
      path: await resolvePath("../..", {
        cwd: await resolver.resolvePath("primevue/base/base"),
      }),
      pattern: "*/*.vue",
      ignore: ["*/Base*.vue", "*table/*Cell.vue"],
      prefix: "P",
      pathPrefix: false,
      watch: false,
    });

    addImports(
      [
        ["useDialog", "primevue/usedialog"],
        ["usePassThrough", "primevue/usepassthrough"],
        ["usePrimeVue", "primevue/config"],
        ["useStyle", "primevue/usestyle"],

        // We work around the issue that the package is resolved from
        // the node_modules where the importing file is. Auto-imports
        // thus find files depending on where it's used, which doesn't
        // work well with Symbol() injections.
        //
        // ["useConfirm", "primevue/useconfirm"],
        // ["useToast", "primevue/usetoast"],
      ].map(([name, from]) => ({ name, from })),
    );
  },
});
