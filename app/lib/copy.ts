/**
 * Words for the guide, the two paths and the tip card. Kept in one file so they can be linted and
 * read as text. US spelling, Oxford comma, no dashes.
 */
export const GUIDE = {
  title: "Count your scans",
  hint: "Campaign tags, Google Analytics, and codes you can change later",
  intro:
    "Add campaign tags to a link code, and your own website analytics can show which flyer, card, or truck brought each visit. ClearQR adds the tags to the web address before the code is made. ClearQR itself counts nothing and collects nothing.",
  tagsTitle: "What the tags mean",
  tags: [
    ["Source", "where the code lives, like flyer."],
    ["Medium", "the kind of thing it is on, like print."],
    ["Campaign", "a name you choose, like spring-sale."],
    ["Content", "optional, for telling two versions apart."],
  ] as [string, string][],
  stepsTitle: "Three steps",
  steps: [
    ["Name each piece", "Open Campaign tags under the link field. Pick a preset such as Flyer, or type your own source and medium. Add a campaign name, then check the address shown for your code."],
    ["Print and scan", "Scan every printed code with your phone and confirm the tagged address opens. Write down which code goes on which piece."],
    ["Read the visits", "In Google Analytics, open Reports, then Acquisition, then Traffic acquisition. Use the plus sign beside the first column heading and choose Session campaign. Each campaign name shows its visits. Menu names can shift a little over time."],
  ] as [string, string][],
  keyTitle: "Count what matters",
  key: "To see results that matter to the business, mark an action as a key event (in Admin, open Events and switch on Mark as key event), such as a form sent or a call tapped. Then you can compare visits with the leads they produced for each printed piece.",
  limitsTitle: "Reading your numbers",
  limits:
    "The numbers are visits to your page. Ad blockers and cookie banners hide some visits, so treat the counts as a minimum. Test the final address in a private window before you print.",
  fullGuide: "Full step-by-step guide",
  fullGuideCount: "to counting your visits",
  fullGuideChange: "to changeable codes",
  changeableTitle: "Make a printed code changeable, on your own",
  changeableIntro: "A printed code is fixed, but a short address on your own domain can be pointed at a new page any time.",
  changeableSteps: [
    ["Pick a short address", "Choose something like yoursite.com/qr/flyer, enter it as the link in ClearQR, and print that code. You own the domain, so the code keeps working as long as you keep the domain and the redirect."],
    ["Forward it", "Set up a temporary redirect (called a 302) from that short address to the page you want. Use a rule in Cloudflare, a plugin in WordPress, or the redirect setting at your web host."],
    ["Change it later", "To send people somewhere new, edit the redirect, and the printed code stays the same. We host nothing and keep no list of your codes."],
  ] as [string, string][],
  changeableCta: "Want this done for you? Fill in the short setup-help form and we will set it up.",
} as const;

export const CALLOUT = {
  diy: "Do it yourself",
  diyNote: "see the steps",
  help: "We set it up",
  helpNote: "ask for help",
} as const;

export const PITCH = {
  headline: "Trackable and changeable QR codes, free.",
  text: "Many tools charge a subscription for trackable, changeable codes. With ClearQR you get both without a subscription, using tools you already have. Add campaign tags, and your own analytics counts the visits each code brings. Point the code at a short address on your own domain, and you can change where it goes later.",
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
