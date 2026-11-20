/**
 * Words of the mini-site home page (deskWork's home-copy.md, accepted at orchestra's gate 2026-11-19).
 * Kept in one file so they can be linted and read as text. Link keys are filled with real paths by HomePage.
 */
export type LinkKey = "app" | "expire" | "track" | "change" | "static" | "setup";

export const HERO = {
  h1: "A free QR code generator that is open source and needs no account",
  lines: [
    "Make a code below, in your browser. A short address on your own domain makes it changeable.",
    "ClearQR tracks nothing; your own analytics counts.",
  ],
  make: "Make a code",
  how: "See how counting and changing work",
  help: "Ask for paid setup help",
  fine: "Counting and changing a code often needs a paid plan elsewhere (as of November 2026).",
  alt: "A flyer with a ClearQR code that stays as printed. Beside it, your analytics counts the visits, and your own web address points the code at a new page.",
  artCode: ["ClearQR code", "(stays as printed)"],
  artCount: "Your analytics",
  artAddress: "Your web address",
} as const;

export interface Choice {
  id: string;
  title: string;
  text: string;
  links: { label: string; to: LinkKey }[];
  more: string[];
}

export const CHOOSER = {
  title: "What do you want your QR code to do?",
  another: "Try another",
  examples: "Examples",
  choices: [
    {
      id: "open",
      title: "Just open a page",
      text: "A ClearQR code holds your web address inside the picture, so there is nothing to renew or cancel. It keeps working as long as the square can be read and your page stays online. Print it dark on light with a clear border, and test it with your own phone.",
      links: [
        { label: "Do QR codes expire?", to: "expire" },
        { label: "Make a code", to: "app" },
      ],
      more: [
        "A yard sign that opens your listing.",
        "Table cards that open the class schedule.",
        "Your booking page, one scan from the flyer.",
        "A shelf label that opens the how-to page.",
        "An offer page on the mailer.",
        "The event page, straight from the poster.",
      ],
    },
    {
      id: "count",
      title: "Tell me how many people scan it",
      text: "Your own analytics counts the visits. When you make a link code, add a label for where it will go, such as flyer or mailer. The label travels inside the address, so your own analytics can show which flyer or card brought each visit. This works when your page already has analytics. Counts are a minimum, because ad blockers and cookie banners hide some visits.",
      links: [{ label: "Count your scans", to: "track" }],
      more: [
        "You see which flyer brought the most visits.",
        "You learn whether the mailer or the business card worked better.",
        "You count the visits that came from the window sign.",
        "You see which volunteer group handed out the most flyers.",
        "You find out if the new packaging insert got a response.",
        "You pick which print run to reorder.",
      ],
    },
    {
      id: "change",
      title: "Let me change where it goes later",
      text: "Put a short address on your own domain (a web address you already own) in the code, then change where that address forwards, with a rule at your web host or a plugin. It keeps working as long as you keep the domain. You keep one printed code and point it at a new page whenever you like. People often call this a dynamic QR code. Your domain does the forwarding, and ClearQR makes the square.",
      links: [{ label: "Change where a QR code goes", to: "change" }],
      more: [
        "The weekly special changed, and the card on every table stays.",
        "The sale ended. The same sign now sends people to the next one.",
        "Your page moved to a new address, and the printed code still works.",
        "Spring turns to summer, and the flyer leads to the new page.",
        "You renamed a page, so you point your short address at the new name.",
        "Nothing gets reprinted, and the page behind the code is brand new.",
      ],
    },
    {
      id: "help",
      title: "I want someone to set it up for me",
      text: "Setup help is a paid service where we do the work: tags on your codes, your analytics checked and your results view set up and explained, a landing page or short address if you use one, and how to manage and change it later. Ask on the setup help page and say what you print, where your domain lives, and which analytics you use. The free route is the guides on this site.",
      links: [{ label: "Ask for setup help", to: "setup" }],
      more: [
        "Have us tag your first flyer.",
        "Have us check your analytics setup.",
        "Have us set up your short address.",
        "Have us set up the page your code opens.",
        "Have us test the printed code.",
        "Ask what setup includes before you print.",
      ],
    },
  ] as Choice[],
} as const;

export const FREE = {
  title: "What free means here",
  text: "ClearQR is open source under the MIT license, so a copy you keep stays free to use. It makes the code in your browser, on this page.",
  facts: [
    "Hosted by us at no cost, so you can skip GitHub.",
    "Open source, with the code there to read.",
    "Nothing you type into ClearQR leaves your device.",
  ],
  credit: "ClearQR is built and maintained by",
} as const;

export const DEV = {
  title: "Note for your developer",
  intro: "The details below are for whoever manages your website.",
  rows: [
    {
      title: "The command line",
      body: [
        "Build it with ",
        { code: "npm run build:cli" },
        ", then run ",
        { code: "node dist/cli.mjs examples/link.json -o link.png" },
        ". Options are ",
        { code: "-o <file>" },
        ", ",
        { code: "--format png|svg" },
        ", and ",
        { code: "--no-verify" },
        ", which skips the scan check. Exit codes: 0 the file is written and the code scans, 1 usage, 2 invalid config, 3 the file is written but the code does not scan.",
      ],
    },
    {
      title: "A config file for every code",
      body: [
        "One JSON file describes a code: type, content, style, image and output. The schema is ",
        { code: "schema/clearqr.schema.json" },
        ", and ",
        { code: "examples/" },
        " has one file per type. The app saves and loads the same format.",
      ],
    },
    {
      title: "The Docker image",
      body: [
        { code: "docker run --rm -p 8088:8080 ghcr.io/clearsky-digital/clearqr:1.1.0" },
        " runs it. Behind a reverse proxy, use ",
        { code: "docker-compose.yml" },
        ", which publishes no port of its own. The local address is ",
        { code: "http://localhost:8088/" },
        ".",
      ],
    },
    {
      title: "The license",
      body: ["MIT license, with the copyright held by ClearSky Digital LLC. You may copy, change, and share it with the license notice kept."],
    },
    {
      title: "What the page's policy blocks",
      body: [
        "The page carries a Content-Security-Policy that includes ",
        { code: "connect-src 'none'" },
        ", which stops its own scripts from opening network connections (fetch, XMLHttpRequest, WebSocket and similar), and ",
        { code: "form-action 'none'" },
        ", which stops form submissions. A link you click still opens its page. It sits in a meta tag, and the Docker image also sends it as a header.",
      ],
    },
  ] as { title: string; body: (string | { code: string })[] }[],
} as const;

export const CLOSE = {
  title: "Make a code in your browser",
  button: "Make a code",
  trademark: "QR Code is a registered trademark of DENSO WAVE INCORPORATED.",
  more: "More guides:",
} as const;
