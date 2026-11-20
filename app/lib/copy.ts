/**
 * Words for the guide, the two paths and the tip card. Kept in one file so they can be linted and
 * read as text. US spelling, Oxford comma, no dashes.
 */
export const GUIDE = {
  title: "Count your scans",
  intro:
    "Add campaign tags to a link code, and your own website analytics can tell you which flyer, card, or truck brought each visit. ClearQR adds the tags to the web address before the code is made. ClearQR itself counts nothing and collects nothing.",
  tagsTitle: "What the tags mean",
  tags: [
    ["Source", "where the code lives, like flyer."],
    ["Medium", "the kind of thing it is on, like print."],
    ["Campaign", "a name you choose, like spring-sale."],
    ["Content", "optional, for telling two versions apart."],
  ] as [string, string][],
  analyticsTitle: "See the scans in Google Analytics",
  analytics: [
    "Open Reports, then Acquisition, then Traffic acquisition. Use the plus sign beside the first column heading and choose Session campaign, and your campaign names show up with their visits. Menu names can shift a little over time.",
    "To see results that matter to the business, mark an action as a key event (in Admin, open Events and switch on Mark as key event), such as a form sent or a call tapped. Then you can compare visits with the leads they produced for each printed piece.",
  ],
  limitsTitle: "Reading your numbers",
  limits:
    "The numbers are visits to your page. Ad blockers and cookie banners hide some visits, so treat the counts as a minimum. Test the final address in a private window before you print.",
  changeableTitle: "Make a printed code changeable, on your own",
  changeableCta: "Want this done for you? Fill in the short setup-help form and we will set it up.",
  changeable: [
    "A printed code is fixed, and a short address on your own domain is flexible. Make the code point to yoursite.com/qr/flyer. Then send that address wherever you like, today and later. You own the domain, so the code keeps working as long as you keep the domain.",
    "Three free ways to forward it: a redirect rule in Cloudflare, a redirect plugin in WordPress, or the redirect setting at your web host. Use a temporary redirect (called a 302), so browsers keep checking your short address.",
    "We host nothing and keep no list of your codes.",
  ],
} as const;

export const PITCH = {
  headline: "Trackable and changeable QR codes, free.",
  text: "Many tools charge a subscription for trackable, changeable codes. With ClearQR you get both without a subscription, using tools you already have. Add campaign tags, and your own analytics counts the scans. Point the code at a short address on your own domain, and you can change where it goes later.",
  how: "How to set it up",
  help: "Get help setting it up",
} as const;

export const PATHS = {
  title: "Two ways to do it",
  freeTitle: "Do it yourself",
  free: "Everything above is free, and you can use it as often as you like.",
  helpTitle: "We set it up for you",
  help: "We will set up the tags, the goal in your analytics, and the forwarding address, then show you how to read the results.",
  helpLink: "Ask for setup help",
  partnership: "We do well when your business does well, so we would rather save you a bill than add one.",
} as const;

export const TIP = {
  title: "Did ClearQR save you a subscription?",
  text: "ClearQR is free, and its codes keep working. If it ended one more monthly expense for your business, a tip is a kind way to say thanks. Tips are optional, are not donations, and are not tax-deductible. We build our tools to keep your costs down.",
  button: "Leave a tip",
  footer: "Tips say thanks",
} as const;

/** An unnamed comparison. Every claim is backed by dated evidence, kept outside the app. No vendor, price, or quote here. */
export const COMPARISON: { title: string; text: string } | null = {
  title: "Why we made ClearQR free",
  text: "We looked at several QR services in November 2026. A plain code that points straight at your page is free to make and keeps working, with ClearQR and with most other services. The cost usually comes in when you want to change where a printed code goes or count its scans. On most paid services, a changeable code stops working when the plan or free trial ends. Changing a code and counting scans usually need a paid plan, and plans often cap the scans or limit how long the numbers are kept. A few give a small free allowance, with low scan limits. ClearQR works another way: ClearQR tracks nothing, and your own analytics does the counting.",
};
