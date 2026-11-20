/**
 * The quick check on the "Do QR codes expire" page. The words of the questions and the verdict table are the page's copy;
 * the rules below are what the table on the page says, so the script and the table agree (a test compares them).
 */
export type Cause = "print" | "page" | "service" | "checklist";
export type Level = "ok" | "watch" | "fix";

export const CAUSE_LABEL: Record<Cause, string> = {
  print: "The print wore out",
  page: "The page it opens is gone, or its domain lapsed",
  service: "A service that held the code stopped",
  checklist: "Keep a printed code readable",
};
export const CAUSE_HREF: Record<Cause, string> = {
  print: "#cause-print",
  page: "#cause-page",
  service: "#cause-service",
  checklist: "#checklist",
};

export type Choice = { value: string; label: string };
const YNN: Choice[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
];

export const FIXED = [
  {
    id: "holder",
    text: "Who holds your code?",
    choices: [
      { value: "self", label: "I made it myself and it holds the address" },
      { value: "service", label: "A service holds it for me" },
      { value: "unsure", label: "Not sure" },
    ],
  },
  { id: "page", text: "Does the page it opens still load?", choices: YNN },
  {
    id: "print",
    text: "How is the print holding up?",
    choices: [
      { value: "clean", label: "Clean and dark" },
      { value: "worn", label: "Worn or faded" },
      { value: "unsure", label: "Not sure" },
    ],
  },
] as const;

type Rule = { flagged: (answer: string) => boolean; cause: Cause };
const yes = (a: string) => a === "yes";
const noOrUnsure = (a: string) => a === "no" || a === "unsure";

const RAW: { id: number; text: string; rule: Rule }[] = [
  { id: 1, text: "Is there a logo over the middle of the code?", rule: { flagged: yes, cause: "print" } },
  { id: 2, text: "Is the code printed large enough to scan from a few steps away?", rule: { flagged: noOrUnsure, cause: "print" } },
  { id: 3, text: "Do you still have the file you made the code from?", rule: { flagged: noOrUnsure, cause: "checklist" } },
  { id: 4, text: "Does the code sit on a curved or shiny surface?", rule: { flagged: yes, cause: "print" } },
  { id: 5, text: "Is the code under a laminate or glass that glares?", rule: { flagged: yes, cause: "print" } },
  { id: 6, text: "Is the code on a sticker that could peel?", rule: { flagged: yes, cause: "print" } },
  { id: 7, text: "Do you know when your domain renews?", rule: { flagged: noOrUnsure, cause: "page" } },
  { id: 8, text: "Did you scan this exact printed copy after it was printed?", rule: { flagged: noOrUnsure, cause: "checklist" } },
  { id: 9, text: "Is an old printed copy still in use somewhere?", rule: { flagged: yes, cause: "checklist" } },
  { id: 10, text: "Did you test the code on more than one phone?", rule: { flagged: noOrUnsure, cause: "checklist" } },
  { id: 11, text: "Is the code on something that gets wet or rubbed?", rule: { flagged: yes, cause: "print" } },
  { id: 12, text: "Is the code printed light on a dark background?", rule: { flagged: yes, cause: "print" } },
];

export const POOL: { id: number; text: string; choices: Choice[]; rule: Rule }[] = RAW.map((q) => ({
  ...q,
  choices: q.id === 7 ? [...YNN, { value: "nodomain", label: "I have no domain" }] : YNN,
}));

export type Trigger = { question: string; answer: string; cause: Cause };
export type Verdict = {
  level: Level;
  title: string;
  triggers: Trigger[];
  /** Shown only when one pool answer is flagged and nothing else is. */
  singleFlag: boolean;
};

export const VERDICT_TITLE: Record<Level, string> = {
  ok: "Should keep working",
  watch: "Works, with one thing to watch",
  fix: "Needs a fix; here is how",
};

const label = (choices: readonly Choice[], v: string) => choices.find((c) => c.value === v)?.label ?? v;

/** `fixed` is keyed by FIXED id, `pool` by question id. Returns null until all five answers are in. */
export function verdict(fixed: Record<string, string>, pool: Record<number, string>, asked: number[]): Verdict | null {
  if (FIXED.some((q) => !fixed[q.id]) || asked.some((id) => !pool[id])) return null;
  const triggers: Trigger[] = [];
  let level: Level = "ok";
  const raise = (l: Level) => {
    if (l === "fix" || (l === "watch" && level === "ok")) level = l;
  };
  const add = (id: (typeof FIXED)[number]["id"], cause: Cause, l: Level) => {
    const q = FIXED.find((f) => f.id === id)!;
    triggers.push({ question: q.text, answer: label(q.choices, fixed[id]), cause });
    raise(l);
  };
  if (fixed.page === "no") add("page", "page", "fix");
  if (fixed.holder === "service" || fixed.holder === "unsure") add("holder", "service", "watch");
  if (fixed.page === "unsure") add("page", "page", "watch");
  if (fixed.print === "worn" || fixed.print === "unsure") add("print", "print", "watch");
  const flagged = asked
    .map((id) => POOL.find((q) => q.id === id)!)
    .filter((q) => q.rule.flagged(pool[q.id]));
  if (flagged.length >= 2) {
    for (const q of flagged) triggers.push({ question: q.text, answer: label(q.choices, pool[q.id]), cause: q.rule.cause });
    raise("watch");
  }
  return {
    level,
    title: VERDICT_TITLE[level],
    triggers,
    singleFlag: level === "ok" && flagged.length === 1,
  };
}

/** Two question ids from the pool, none repeated. `rand` returns a number in [0, 1). */
export function drawTwo(rand: () => number, not: number[] = []): number[] {
  const ids = POOL.map((q) => q.id).filter((id) => !not.includes(id));
  const first = ids.splice(Math.floor(rand() * ids.length), 1)[0];
  const second = ids.splice(Math.floor(rand() * ids.length), 1)[0];
  return [first, second];
}

/** The verdict table of the page, as rows of [answer, verdict, cause]. */
export const VERDICT_TABLE: [string, string, string][] = [
  ["Page it opens: No", "Needs a fix; here is how", "The page it opens is gone"],
  ["Who holds the code: A service holds it", "Works, with one thing to watch", "A service that held the code stopped"],
  ["Who holds the code: Not sure", "Works, with one thing to watch", "A service that held the code stopped"],
  ["Page it opens: Not sure", "Works, with one thing to watch", "The page it opens is gone"],
  ["Print: Worn or faded, or Not sure", "Works, with one thing to watch", "The print wore out"],
  ["One flagged pool answer", "Should keep working, with a line pointing to the checklist below", "The checklist below"],
  ["Two or more flagged pool answers", "Works, with one thing to watch", "The cause each flagged answer maps to"],
  ["Everything else", "Should keep working", "None"],
];
