import type { Dictionary } from "./ru"

const en: Dictionary = {
  meta: {
    title: "QuickSend — bulk email from your own Gmail",
    description:
      "Personal bulk campaigns right from Gmail: recipients from Google Sheets, scheduled sending, human pacing and statistics in your dashboard.",
  },
  nav: {
    how: "How it works",
    features: "Features",
    pricing: "Pricing",
    faq: "FAQ",
    login: "Sign in",
    dashboard: "Dashboard",
  },
  hero: {
    title: "Send it flying.",
    text: "Bulk campaigns from your own Gmail. Every letter leaves from an address inboxes already trust.",
    install: "Add to Chrome",
    start: "Start for free",
  },
  route: {
    title: "From list to inbox in one flight.",
    lede: "No SMTP, no DNS records, no domain warm-up. The extension works inside the Gmail you already use.",
    legs: [
      { tag: "Takeoff", title: "Connect Gmail", text: "Sign up, install the extension and sign in with Google. Nothing else to configure." },
      { tag: "Climb", title: "Add recipients", text: "Pick a Google Sheet or paste addresses into the To field. Duplicates and invalid addresses are dropped for you." },
      { tag: "Landing", title: "Launch", text: "Send now or schedule it. Letters go out spaced like a person wrote them." },
    ],
  },
  specs: {
    title: "Built for deliverability.",
    items: [
      { title: "Your sender, your reputation", text: "Mail goes through the Gmail API from your account, not a shared server pool that spam filters already know." },
      { title: "Sheets as the source", text: "Keep the list where your team already works. QuickSend reads the addresses from a Google Sheet at launch." },
      { title: "Human pacing", text: "Sending is spread over time and stays inside Gmail's daily limits." },
      { title: "Everything Gmail can do", text: "HTML formatting, attachments, signature — write the email as usual, QuickSend does the rest." },
      { title: "Scheduling", text: "Pick a date and time in your own timezone. A campaign can be cancelled before it finishes." },
      { title: "Dashboard with stats", text: "Status of every campaign, how many letters went out and how many failed — in your dashboard on the website." },
    ],
    soon: "Coming soon",
    soonItems: ["Merge fields from the sheet: {{name}}, {{company}}", "Unsubscribe link in every letter"],
  },
  pricing: {
    title: "Pricing",
    lede: "Start free: 10 days and 50 emails a day. Pay by card via YooKassa or with PayPal.",
    monthly: "Monthly",
    yearly: "Yearly",
    yearlyBadge: "−20%",
    perMonth: "/mo",
    billedYearly: "billed yearly",
    free: "Free",
    popular: "Popular",
    perDay: "emails a day",
    plans: {
      trial: { name: "Trial", note: "10 days, no card", cta: "Start for free" },
      standard: { name: "Standard", note: "For regular campaigns", cta: "Choose Standard" },
      premium: { name: "Premium", note: "Requires Google Workspace — regular Gmail is limited to about 500 emails a day", cta: "Choose Premium" },
    },
    features: {
      common: ["Sending via your Gmail", "Recipients from Google Sheets", "Scheduling and cancellation", "Dashboard statistics"],
      priority: "Priority support",
    },
    payWith: "Payment methods",
    yookassa: "YooKassa — Russian cards, SBP",
    paypal: "PayPal — international cards",
    more: "Pricing details",
  },
  faq: {
    title: "FAQ",
    items: [
      { q: "What do I need to use QuickSend?", a: "A Gmail or Google Workspace account and the Chrome browser with the QuickSend extension installed." },
      { q: "From what server are my emails sent?", a: "From Gmail's servers, on your behalf via the Gmail API. Every email sent appears in your Sent folder." },
      { q: "How many emails can I send per day?", a: "As many as your plan allows, but no more than Gmail's daily limit: about 500 for a regular account and about 2,000 for Google Workspace. When today's limit is reached, the rest go out the next day automatically." },
      { q: "Can I send attachments?", a: "Yes. Write the email in Gmail as usual, attach files and press the QuickSend button. Total attachment size is up to 18 MB." },
      { q: "Does QuickSend read my email?", a: "No. We only request permission to send email on your behalf. QuickSend has no access to your inbox or conversations." },
      { q: "How do I cancel and delete my data?", a: "Subscriptions do not renew automatically. To delete your account and all data, contact support — we will do it within 30 days." },
    ],
  },
  cta: {
    title: "Cleared for takeoff.",
    text: "Free to start. No card needed.",
  },
  footer: {
    rights: "QuickSend",
    notAffiliated: "Not affiliated with Google. Gmail is a trademark of Google LLC.",
    privacy: "Privacy",
    terms: "Terms",
    contact: "Support",
  },
  lang: { switchTo: "RU", label: "Переключить на русский" },
  notFound: { title: "Off course.", text: "This page does not exist.", home: "Back home" },
}

export default en
