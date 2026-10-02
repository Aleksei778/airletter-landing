// Public settings, safe to expose to the browser
export const site = {
  name: "Airletter",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // Chrome Web Store page of the extension
  extensionUrl: process.env.NEXT_PUBLIC_EXTENSION_URL ?? "https://chromewebstore.google.com/",
  // must be set before launch: legal pages and the footer point to it
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "",
  // Seller details YooKassa requires on the site (Russian version):
  // full name, INN and tax status of the self-employed person
  seller: {
    name: process.env.NEXT_PUBLIC_SELLER_NAME ?? "",
    inn: process.env.NEXT_PUBLIC_SELLER_INN ?? "",
    status: process.env.NEXT_PUBLIC_SELLER_STATUS ?? "самозанятый, плательщик НПД",
  },
}
