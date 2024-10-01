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
    `<div class="${msg.rootClass ?? "flex flex-column align-items-center"}">` +
    `<div class="p-message${msg.severity ? " p-message-" + msg.severity : ""}">` +
    `<div class="p-message-wrapper p-message-text">${msg.message}</div>` +
    `</div>` +
    `</div>`
  );
}
