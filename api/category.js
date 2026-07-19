import { getHomePayload, getCategoryPosts } from "../server/wordpress.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: "slug required" });

  try {
    const live = await getCategoryPosts(slug);
    if (live && live.length) return res.status(200).json(live);

    const { articles } = await getHomePayload();
    const norm = (x) => x.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const groups = [
      ["ai", "artificial-intelligence"],
      ["tech", "technology"],
    ];
    const same = (a, b) =>
      a === b || groups.some((g) => g.includes(a) && g.includes(b));
    res.status(200).json(
      articles.filter((a) => a.tags.some((t) => same(norm(t), slug)))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
