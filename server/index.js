import express from "express";
import cors from "cors";
import compression from "compression";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import {
  getHomePayload,
  getPostBySlug,
  getCategoryPosts,
  getAuthor,
} from "./wordpress.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Minimal .env loader (WP_API_URL etc.)
try {
  const env = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.+?)\s*$/);
    if (m && !process.env[m[1]])
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  /* no .env — fine */
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(compression());
app.use(express.json());

// ---------- API ----------

app.get("/api/home", async (_req, res) => {
  try {
    res.json(await getHomePayload());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/articles", async (req, res) => {
  const { articles } = await getHomePayload();
  const { tag } = req.query;
  if (!tag) return res.json(articles);
  const t = String(tag).toLowerCase();
  res.json(
    articles.filter((a) => a.tags.some((x) => x.toLowerCase().includes(t)))
  );
});

app.get("/api/author/:slug", async (req, res) => {
  const author = await getAuthor(req.params.slug);
  if (!author) return res.status(404).json({ error: "Author not found" });
  res.json(author);
});

app.get("/api/category/:slug", async (req, res) => {
  const live = await getCategoryPosts(req.params.slug);
  if (live && live.length) return res.json(live);
  const { articles } = await getHomePayload();
  const slug = req.params.slug.toLowerCase();
  const norm = (x) => x.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const groups = [
    ["ai", "artificial-intelligence"],
    ["tech", "technology"],
  ];
  const same = (a, b) =>
    a === b || groups.some((g) => g.includes(a) && g.includes(b));
  res.json(articles.filter((a) => a.tags.some((t) => same(norm(t), slug))));
});

// Single post/tidbit: cached payload first, then live slug lookup.
app.get("/api/articles/:id", async (req, res) => {
  const { articles, tidbits } = await getHomePayload();
  const id = req.params.id;
  const cached =
    articles.find((a) => a.id === id) || tidbits.find((t) => t.id === id);
  if (cached) return res.json(cached);

  const live = await getPostBySlug(id);
  if (live) return res.json(live);

  res.status(404).json({ error: "Article not found" });
});

// ---------- Static client (production) ----------

const dist = path.join(__dirname, "..", "client", "dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
}

app.listen(PORT, () => {
  console.log(`SpaceRock server orbiting at http://localhost:${PORT}`);
  console.log(`Content source: WordPress (${process.env.WP_API_URL || "default: spacerock.club"}) with local fallback`);
});
