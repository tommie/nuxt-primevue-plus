import { Theme, dt } from "@primeuix/styled";
import { resolve } from "@primeuix/utils/object";
import InlineMessageStyle from "primevue/inlinemessage/style";

export interface StaticMessageOptions {
  // The message HTML string.
  message: string;

  // The classes of the wrapping root element. The default is to center the message.
  rootClass?: string;

  // The severity of the message.
  severity?: "info" | "success" | "warn" | "error";
}

/// Emulates a PrimeVue message, useful inside
/// `useHead({noscript})`. Strings are passed on directly to HTML
/// without escaping, so make sure they are safe.
export function createStaticMessage(msg: StaticMessageOptions) {
  return (
    Theme.getStyleSheet("inlinemessage") +
    `<style>${Theme.transformCSS("inlinemessage", resolve(InlineMessageStyle.theme, { dt }))}</style>` +
    `<div class="${msg.rootClass ?? "flex flex-col items-center"}">` +
    `<div role="alert" aria-live="assertive" aria-atomic="true" class="p-inlinemessage p-component${msg.severity ? " p-inlinemessage-" + msg.severity : ""}">` +
    `<div class="p-inlinemessage-text">${msg.message}</div>` +
    `</div>` +
    `</div>`
  );
}
