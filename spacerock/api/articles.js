import { getHomePayload, getPostBySlug } from "../server/wordpress.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { id, tag } = req.query;

  // /api/articles?id=<slug>
  if (id) {
    try {
      const { articles, tidbits } = await getHomePayload();
      const cached =
        articles.find((a) => a.id === id) ||
        tidbits.find((t) => t.id === id);
      if (cached) return res.status(200).json(cached);
      const live = await getPostBySlug(id);
      if (live) return res.status(200).json(live);
      return res.status(404).json({ error: "Not found" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // /api/articles?tag=<tag>
  try {
    const { articles } = await getHomePayload();
    if (!tag) return res.status(200).json(articles);
    const t = String(tag).toLowerCase();
    res.status(200).json(
      articles.filter((a) => a.tags.some((x) => x.toLowerCase().includes(t)))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
