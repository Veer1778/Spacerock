import { getAuthor } from "../server/wordpress.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: "slug required" });
  try {
    const author = await getAuthor(slug);
    if (!author) return res.status(404).json({ error: "Author not found" });
    res.status(200).json(author);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
