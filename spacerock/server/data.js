// SpaceRock content store.
// Swap this out for the WordPress REST API / any CMS later —
// the shapes here are the contract the frontend expects.

export const topics = [
  "Anthropic",
  "Artificial intelligence",
  "Technology",
  "Physics",
  "NASA",
  "OpenAI",
  "Nvidia",
];

const sampleContent = (lede) => `
<p>${lede}</p>
<p>This is placeholder body copy for local development. Connect the site to
WordPress (it is by default) and the full article content, images and
formatting come straight from <code>content.rendered</code>.</p>
<p>Everything you see on this page — the byline, hero image, tags and body —
is served by the Node API from the same payload the homepage uses.</p>`;

const author = { name: "Veer Solanki", avatar: null };

export const articles = [
  {
    id: "claude-mythos",
    slot: "lead",
    title: "Claude Mythos: Why It\u2019s Too Dangerous to Release",
    excerpt:
      "Anthropic has positioned itself as one of the leading AI labs in the world. Maybe the only one with morals, as it appeared during their negotiations with the Department of War.",
    tags: ["Artificial Intelligence", "Anthropic", "OpenAI"],
    image: "/images/claude-mythos.jpg",
    date: "2026-07-08",
    dateFormatted: "2026-07-08",
    content: sampleContent("Local preview article."),
    author,
  },
  {
    id: "sora-goodbye",
    slot: "column",
    title: "OpenAI Sora: Why It Wasn\u2019t Really Ready",
    excerpt:
      "Monday they posted the goodbye. Short. Almost breezy about it. \u201cWe\u2019re saying goodbye to Sora\u201d \u2014 and then some warm language about the community, and then something about details coming soon.",
    tags: ["Artificial Intelligence", "OpenAI"],
    image: "/images/sora.jpg",
    date: "2026-07-06",
    dateFormatted: "2026-07-06",
    content: sampleContent("Local preview article."),
    author,
  },
  {
    id: "cortical-doom",
    slot: "side",
    title: "New tech evolves from Cortical Labs: Brain cells play Doom",
    excerpt:
      "Doom, a classic video game released in the year 1993 is now more or less a meme, as people joke about how the game can run on any device.",
    tags: ["AI", "Technology"],
    image: "/images/cortical-doom.jpg",
    date: "2026-07-05",
    dateFormatted: "2026-07-05",
    content: sampleContent("Local preview article."),
    author,
  },
  {
    id: "martian-rovers",
    slot: "column",
    title: "Martian rovers: the new golden age of planetary exploration",
    excerpt:
      "Humans have sent multiple missions to Mars, once they were able to venture to the Moon. Over the years many rovers have been sent to explore the Martian surface.",
    tags: ["Physics", "NASA"],
    image: "/images/rovers.jpg",
    date: "2026-07-03",
    dateFormatted: "2026-07-03",
    content: sampleContent("Local preview article."),
    author,
  },
  {
    id: "pentagon-ai",
    slot: "column",
    title: "Silicon Valley\u2019s New Battlefield: AI, Ethics and the Pentagon",
    excerpt:
      "It was supposed to be a government contract. It became a big problem that showed how different people in Silicon Valley think about war, ethics and the future of artificial intelligence.",
    tags: ["Artificial Intelligence", "OpenAI"],
    image: "/images/pentagon.jpg",
    date: "2026-07-01",
    dateFormatted: "2026-07-01",
    content: sampleContent("Local preview article."),
    author,
  },
  {
    id: "mythos-vanished",
    slot: "feature",
    title: "Why Anthropic\u2019s Most Powerful AI Vanished after Just 3 Days",
    excerpt: "",
    tags: ["Artificial Intelligence", "Anthropic"],
    image: "/images/mythos-vanished.jpg",
    date: "2026-06-30",
    dateFormatted: "2026-06-30",
    content: sampleContent("Local preview article."),
    author,
  },
  {
    id: "s26-privacy",
    slot: "column",
    title: "Samsung S26 Ultra has a privacy screen: is it good?",
    excerpt:
      "The Samsung S26 Ultra now has a new feature called the Privacy display, which basically does the work of a privacy screen protector but way better.",
    tags: ["AI", "Technology"],
    image: "/images/s26.jpg",
    date: "2026-06-28",
    dateFormatted: "2026-06-28",
    content: sampleContent("Local preview article."),
    author,
  },
  {
    id: "dlss-5",
    slot: "feature-right",
    title: "DLSS 5: Why It Isn\u2019t Really Free Performance",
    excerpt:
      "There is a version of this article where I just explain what DLSS 5 is and tell you it looks pretty good and leave it there.",
    tags: ["AI", "Nvidia"],
    image: "/images/dlss5.jpg",
    date: "2026-06-27",
    dateFormatted: "2026-06-27",
    content: sampleContent("Local preview article."),
    author,
  },
];

export const tidbits = [
  {
    id: "opus-48",
    title: "Anthropic\u2019s Opus 4.8",
    date: "June 13, 2026",
    excerpt:
      "Anthropic has released Claude Opus 4.8, the newest version of its most advanced publicly available model, positioned as a more effective collaborator across coding, reasoning, and knowledge work.",
    image: "/images/tidbit-opus.jpg",
    tilt: -2,
  },
  {
    id: "dipoles",
    title: "How Electric Fields Turn Neutral Molecules into Dipoles",
    date: "April 14, 2026",
    excerpt:
      "When you put a substance that does not have an electric charge in a uniform electric field it starts to get polarized. This happens because the charges inside its molecules get a bit mixed up.",
    image: "/images/tidbit-dipoles.jpg",
    tilt: 3,
  },
  {
    id: "macbook-neo",
    title: "Apple\u2019s new MacBook Neo targets a cheaper MacBook tier",
    date: "March 21, 2026",
    excerpt:
      "Apple has introduced the MacBook Neo as a new entry-level addition to its laptop lineup, aimed at expanding access to the macOS ecosystem. Positioned below the MacBook Air, the device focuses on delivering core MacBook features at a more affordable price point.",
    image: "/images/tidbit-neo.jpg",
    tilt: -2,
  },
  {
    id: "nebius",
    title: "Meta just validated a smaller AI cloud bet",
    date: "March 18, 2026",
    excerpt:
      "Nebius, a Dutch cloud provider most people have never heard of, just secured a deal worth up to $27 billion from Meta \u2014 $12 billion in dedicated AI capacity with up to $15 billion more in additional compute over five years, partly built on NVIDIA\u2019s Vera Rubin chips, sending the stock up 14%.",
    image: "/images/tidbit-nebius.jpg",
    tilt: 3,
  },
];

export const facts = [
  {
    id: "tokens",
    text: "Claude Opus 4.8 trained on 30+ trillion tokens \u2014 the first Anthropic model to disclose its corpus size publicly.",
    tilt: -2,
  },
  {
    id: "apollo",
    text: "Claude Opus 4.8\u2019s $1.5B training run cost more than Apollo 11 in inflation-adjusted dollars.",
    tilt: 3,
  },
  {
    id: "jwst",
    text: "JWST has now found 17 galaxies dated to just 300 million years after the Big Bang \u2014 too mature to exist that early.",
    tilt: -5,
  },
  {
    id: "ligo",
    text: "LIGO caught a gravitational wave in March 2026 that lasted 0.4 seconds longer than any known merger should produce.",
    tilt: 0,
  },
  {
    id: "framework",
    text: "Framework\u2019s latest laptop is the first to ship with a working Linux fingerprint sensor \u2014 an 11-year-old open-source problem, solved.",
    tilt: -4,
  },
];
