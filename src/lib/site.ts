// Public settings, safe to expose to the browser
export const site = {
  name: "QuickSend",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // Chrome Web Store page of the extension
  extensionUrl: process.env.NEXT_PUBLIC_EXTENSION_URL ?? "https://chromewebstore.google.com/",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@quicksend.app",
  // Seller details are required on the site by YooKassa and PayPal
  legalEntity: process.env.NEXT_PUBLIC_LEGAL_ENTITY ?? "",
}
