// WordPress REST API adapter for SpaceRock.
// WP_API_URL env overrides the default live endpoint. Falls back to
// local data.js content whenever WordPress is unreachable.

import {
  topics as localTopics,
  articles as localArticles,
  tidbits as localTidbits,
  facts as localFacts,
} from "./data.js";

const wpApiUrl = () =>
  (process.env.WP_API_URL || "https://cms.spacerock.club/wp-json/wp/v2").replace(/\/$/, "");

const CACHE_TTL_MS = 5 * 60 * 1000;

// Homepage slots per the layout: 1 lead, 2 feature, 3 side, 4 feature-right, 5-8 wire/cards
const SLOT_ORDER = [
  "lead",
  "feature",
  "side",
  "feature-right",
  "column",
  "column",
  "column",
  "column",
];

const TILTS = [-2, 3, -5, 2, -4];

let cache = { at: 0, payload: null };

function stripHtml(html = "") {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&hellip;/g, "\u2026")
    .replace(/&#8217;|&rsquo;/g, "\u2019")
    .replace(/&#8216;|&lsquo;/g, "\u2018")
    .replace(/&#8220;|&ldquo;/g, "\u201c")
    .replace(/&#8221;|&rdquo;/g, "\u201d")
    .replace(/&#8211;|&ndash;/g, "\u2013")
    .replace(/&#8212;|&mdash;/g, "\u2014")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\[\u2026\]\s*$/, "\u2026")
    .trim();
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function mediaUrl(media) {
  if (!media) return null;
  const sizes = media.media_details?.sizes || {};
  return (
    sizes.large?.source_url ||
    sizes.medium_large?.source_url ||
    sizes.full?.source_url ||
    sizes.medium?.source_url ||
    media.source_url ||
    null
  );
}

function firstContentImage(html = "") {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

function postAuthor(post) {
  const authors = post._embedded?.author || [];
  const a = authors.find((x) => x.id === post.author) || authors[0];
  return {
    name: a?.name || "SpaceRock",
    slug: a?.slug || null,
    avatar: a?.avatar_urls?.["48"] || a?.avatar_urls?.["96"] || null,
  };
}

function mapPost(post, index = 4) {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const terms = post._embedded?.["wp:term"]?.flat() || [];
  const tags = terms.map((t) => t?.name).filter(Boolean).slice(0, 3);

  return {
    id: post.slug || String(post.id),
    slot: SLOT_ORDER[index] || "column",
    title: stripHtml(post.title?.rendered),
    excerpt: stripHtml(post.excerpt?.rendered),
    content: post.content?.rendered || "",
    tags: tags.length ? tags : ["Technology"],
    image: mediaUrl(media) || firstContentImage(post.content?.rendered),
    date: post.date,
    dateFormatted: fmtDate(post.date),
    author: postAuthor(post),
    link: post.link,
  };
}

function mapTidbit(post, index = 0) {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  return {
    id: post.slug || String(post.id),
    title: stripHtml(post.title?.rendered),
    content: post.content?.rendered || "",
    tags: ["Tidbit"],
    author: postAuthor(post),
    date: fmtDate(post.date),
    dateFormatted: fmtDate(post.date),
    excerpt:
      stripHtml(post.excerpt?.rendered) ||
      stripHtml(post.content?.rendered).slice(0, 220),
    image: mediaUrl(media) || firstContentImage(post.content?.rendered),
    tilt: index % 2 === 0 ? -2 : 3,
    link: post.link,
  };
}

function mapFact(post, index = 0) {
  // Content only — the fact IS the post body.
  return {
    id: post.slug || String(post.id),
    text:
      stripHtml(post.content?.rendered) ||
      stripHtml(post.excerpt?.rendered) ||
      stripHtml(post.title?.rendered),
    tilt: TILTS[index % TILTS.length],
  };
}

async function wpFetch(path) {
  const res = await fetch(`${wpApiUrl()}${path}`, {
    headers: {
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (compatible; SpaceRockBot/1.0; +https://spacerock.club)",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`WordPress API ${res.status} on ${path}`);
  return res.json();
}

async function termIdBySlug(slugs, kind = "categories") {
  for (const slug of slugs) {
    try {
      const res = await wpFetch(`/${kind}?slug=${encodeURIComponent(slug)}`);
      if (Array.isArray(res) && res[0]?.id) return res[0].id;
    } catch {
      /* try next */
    }
  }
  return null;
}

async function fetchFromWordPress() {
  const posts = await wpFetch(
    "/posts?per_page=8&orderby=date&order=desc&status=publish&_embed"
  );
  if (!Array.isArray(posts) || posts.length === 0) {
    throw new Error("WordPress returned no posts");
  }
  console.log(
    `WordPress: pulled ${posts.length} posts (latest: "${stripHtml(
      posts[0]?.title?.rendered
    ).slice(0, 60)}")`
  );

  // Topics: every tag used across the blog, ranked most -> least used
  let topics = localTopics;
  try {
    const tags = await wpFetch(
      "/tags?per_page=100&orderby=count&order=desc&hide_empty=true"
    );
    const named = tags
      .filter((t) => t?.name && (t.count || 0) > 0)
      .map((t) => t.name);
    if (named.length) topics = named;
  } catch {
    /* keep local topics */
  }

  // Tidbits: CPT (both rest bases) first, then a "tidbits" category. 12 for the pager.
  let tidbits = localTidbits;
  let gotTidbits = false;
  for (const base of ["/tidbits", "/tidbit"]) {
    try {
      const t = await wpFetch(`${base}?per_page=12&orderby=date&order=desc&_embed`);
      if (Array.isArray(t) && t.length) {
        tidbits = t.map(mapTidbit);
        gotTidbits = true;
        console.log(`Tidbits: pulled ${t.length} from ${base}`);
        break;
      }
    } catch {
      /* try next base */
    }
  }
  if (!gotTidbits) {
    const catId = await termIdBySlug(["tidbits", "tidbit", "this-just-in"]);
    if (catId) {
      try {
        const t = await wpFetch(`/posts?categories=${catId}&per_page=12&_embed`);
        if (Array.isArray(t) && t.length) tidbits = t.map(mapTidbit);
      } catch {
        /* keep local */
      }
    }
  }

  // Facts: the "fact" custom post type (tries both rest bases), then a category
  let facts = localFacts;
  let gotFacts = false;
  for (const base of ["/fact", "/facts"]) {
    try {
      const f = await wpFetch(`${base}?per_page=8&orderby=date&order=desc`);
      if (Array.isArray(f) && f.length) {
        facts = f.map(mapFact);
        gotFacts = true;
        console.log(`Facts: pulled ${f.length} from ${base}`);
        break;
      }
    } catch {
      /* try next base */
    }
  }
  if (!gotFacts) {
    const catId = await termIdBySlug(["facts", "fact-station", "fact"]);
    if (catId) {
      try {
        const f = await wpFetch(`/posts?categories=${catId}&per_page=8&_embed`);
        if (Array.isArray(f) && f.length) facts = f.map(mapFact);
      } catch {
        /* keep local */
      }
    }
  }

  return {
    source: "wordpress",
    topics,
    articles: posts.map((p, i) => mapPost(p, i)),
    tidbits,
    facts,
  };
}

export async function getHomePayload() {
  const now = Date.now();
  if (cache.payload && now - cache.at < CACHE_TTL_MS) return cache.payload;

  try {
    const payload = await fetchFromWordPress();
    cache = { at: now, payload };
    return payload;
  } catch (err) {
    console.warn(`WordPress fetch failed (${err.message}) — using local data.`);
  }

  const payload = {
    source: "local",
    topics: localTopics,
    articles: localArticles,
    tidbits: localTidbits,
    facts: localFacts,
  };
  cache = { at: now, payload };
  return payload;
}

// Direct slug lookup so ANY post or tidbit opens in-site, even beyond
// the cached homepage payload.
export async function getPostBySlug(slug) {
  try {
    const posts = await wpFetch(
      `/posts?slug=${encodeURIComponent(slug)}&_embed`
    );
    if (Array.isArray(posts) && posts[0]) return mapPost(posts[0], 4);
  } catch {
    /* fall through */
  }
  for (const base of ["/tidbits", "/tidbit"]) {
    try {
      const t = await wpFetch(`${base}?slug=${encodeURIComponent(slug)}&_embed`);
      if (Array.isArray(t) && t[0]) return mapTidbit(t[0], 0);
    } catch {
      /* try next */
    }
  }
  return null;
}

export async function getCategoryPosts(slug) {
  try {
    let termParam = null;
    const catId = await termIdBySlug([slug], "categories");
    if (catId) termParam = `categories=${catId}`;
    if (!termParam) {
      const tagId = await termIdBySlug([slug], "tags");
      if (tagId) termParam = `tags=${tagId}`;
    }
    if (!termParam) return null;
    const posts = await wpFetch(
      `/posts?${termParam}&per_page=50&orderby=date&order=desc&_embed`
    );
    if (!Array.isArray(posts)) return null;
    return posts.map((p) => ({ ...mapPost(p, 4), slot: "card" }));
  } catch (err) {
    console.warn(`Category fetch failed for "${slug}": ${err.message}`);
    return null;
  }
}

// Native author page data: user info + their posts, straight from WP.
export async function getAuthor(slug) {
  try {
    const users = await wpFetch(`/users?slug=${encodeURIComponent(slug)}`);
    const u = Array.isArray(users) ? users[0] : null;
    if (!u) return null;
    let posts = [];
    try {
      const p = await wpFetch(
        `/posts?author=${u.id}&per_page=24&orderby=date&order=desc&_embed`
      );
      if (Array.isArray(p)) posts = p.map((x) => ({ ...mapPost(x, 4), slot: "card" }));
    } catch {
      /* author with no posts is fine */
    }
    return {
      name: u.name,
      slug: u.slug,
      bio: stripHtml(u.description || ""),
      avatar: u.avatar_urls?.["96"] || u.avatar_urls?.["48"] || null,
      posts,
    };
  } catch (err) {
    console.warn(`Author fetch failed for "${slug}": ${err.message}`);
    return null;
  }
}
