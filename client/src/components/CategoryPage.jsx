import { useEffect, useState } from "react";
import Thumb from "./Thumb.jsx";
import Reveal from "./Reveal.jsx";
import { slugify, tagMatchesSlug } from "../App.jsx";

export default function CategoryPage({ slug, articles }) {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    setPosts(null);
    fetch(`/api/category/${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((list) => setPosts(Array.isArray(list) ? list : []))
      .catch(() =>
        setPosts(articles.filter((a) => a.tags.some((t) => tagMatchesSlug(t, slug))))
      );
  }, [slug]);

  const NAMES = {
    ai: "AI",
    "artificial-intelligence": "AI",
    tech: "Tech",
    technology: "Tech",
    physics: "Physics",
  };
  const topic = NAMES[slug] || slug.replace(/-/g, " ");

  if (!posts) {
    return (
      <div className="loading">
        <p>&gt;_ scanning the archive<span>▌</span></p>
      </div>
    );
  }

  const [cover, ...rest] = posts;

  return (
    <main className="cat">
      {/* Masthead */}
      <div className="cat__mast">
        <p className="cat__eyebrow">// Category</p>
        <div className="cat__mastrow">
          <h2 className="cat__title">{topic}</h2>
          <span className="cat__sticker">
            {posts.length}
            <em>{posts.length === 1 ? "story" : "stories"}</em>
          </span>
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="story__excerpt">
          Nothing filed under this topic yet.{" "}
          <a href="#/" className="subpage__back">← Back to the front page</a>
        </p>
      ) : (
        <>
          {/* Cover story */}
          {cover && (
            <Reveal>
              <article className="cat-cover">
                <span className="cat-card__num cat-card__num--cover">01</span>
                <a href={`#/post/${cover.id}`}>
                  <Thumb src={cover.image} alt={cover.title} variant="wide" label="cover.jpg" />
                </a>
                <div className="cat-cover__text">
                  <div className="story__tags">
                    {cover.tags.slice(0, 3).map((t) => (
                      <a key={t} href={`#/category/${slugify(t)}`}
                         className="pill pill--sm pill--interactive">
                        {t}
                      </a>
                    ))}
                  </div>
                  <h3 className="story__title story__title--feature clamp-3">
                    <a href={`#/post/${cover.id}`}>{cover.title}</a>
                  </h3>
                  <p className="story__excerpt clamp-3">{cover.excerpt}</p>
                  <a className="chip chip--action" href={`#/post/${cover.id}`}>
                    Read the story →
                  </a>
                </div>
              </article>
            </Reveal>
          )}

          {/* Numbered grid */}
          <div className="cat-grid">
            {rest.map((a, i) => (
              <Reveal key={a.id} delay={(i % 3) * 70}>
                <article className="cat-card">
                  <span className="cat-card__num">
                    {String(i + 2).padStart(2, "0")}
                  </span>
                  <a href={`#/post/${a.id}`}>
                    <Thumb src={a.image} alt={a.title} variant="wide" label="post.jpg" />
                  </a>
                  <p className="cat-card__date">{a.dateFormatted || ""}</p>
                  <h3 className="story__title story__title--sm clamp-2">
                    <a href={`#/post/${a.id}`}>{a.title}</a>
                  </h3>
                  {a.excerpt && (
                    <p className="story__excerpt clamp-3">{a.excerpt}</p>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
