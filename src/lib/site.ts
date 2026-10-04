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
    // the same name in Latin letters for the English pages
    nameEn: process.env.NEXT_PUBLIC_SELLER_NAME_EN ?? "",
    // at least city and country; the privacy policy names the data controller
    address: process.env.NEXT_PUBLIC_SELLER_ADDRESS ?? "",
    inn: process.env.NEXT_PUBLIC_SELLER_INN ?? "",
    status: process.env.NEXT_PUBLIC_SELLER_STATUS ?? "самозанятый, плательщик НПД",
  },
  // where the backend and its database run, e.g. "Timeweb Cloud, Russia";
  // the privacy policy must name it
  dataHosting: process.env.NEXT_PUBLIC_DATA_HOSTING ?? "",
}
