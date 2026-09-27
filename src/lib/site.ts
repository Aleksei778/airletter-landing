// Public settings, safe to expose to the browser
export const site = {
  name: "Airletter",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // Chrome Web Store page of the extension
  extensionUrl: process.env.NEXT_PUBLIC_EXTENSION_URL ?? "https://chromewebstore.google.com/",
  // must be set before launch: legal pages and the footer point to it
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "",
  // Seller details are required on the site by YooKassa and PayPal
  legalEntity: process.env.NEXT_PUBLIC_LEGAL_ENTITY ?? "",
}
