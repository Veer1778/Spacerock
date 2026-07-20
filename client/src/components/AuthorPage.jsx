import { useEffect, useState } from "react";
import Thumb from "./Thumb.jsx";
import Reveal from "./Reveal.jsx";
import { slugify } from "../App.jsx";

export default function AuthorPage({ slug }) {
  const [author, setAuthor] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setAuthor(null);
    setFailed(false);
    fetch(`/api/author/${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setAuthor)
      .catch(() => setFailed(true));
  }, [slug]);

  if (failed) {
    return (
      <main className="subpage">
        <div className="subpage__head">
          <p className="subpage__eyebrow">404</p>
          <h2 className="subpage__title gradient-text">Unknown transmission</h2>
          <p className="subpage__count">
            No author found at this callsign.{" "}
            <a className="subpage__back" href="#/">← Back to the front page</a>
          </p>
        </div>
      </main>
    );
  }

  if (!author) {
    return (
      <div className="loading">
        <p>&gt;_ locating author<span>▌</span></p>
      </div>
    );
  }

  const initials = author.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <main className="author">
      {/* Profile masthead */}
      <Reveal>
        <section className="author__mast">
          <div className="author__id">
            <div className="author__photo">
              {author.avatar ? (
                <img src={author.avatar} alt={author.name} />
              ) : (
                <span className="author__mono">{initials}</span>
              )}
            </div>
            <div>
              <p className="subpage__eyebrow">// Author</p>
              <h1 className="author__name">{author.name}</h1>
              {author.bio && <p className="author__bio">{author.bio}</p>}
            </div>
          </div>
          <span className="cat__sticker">
            {author.posts.length}
            <em>{author.posts.length === 1 ? "story" : "stories"}</em>
          </span>
        </section>
      </Reveal>

      {/* Their stories */}
      {author.posts.length > 0 ? (
        <div className="cat-grid">
          {author.posts.map((a, i) => (
            <Reveal key={a.id} delay={(i % 3) * 70}>
              <article className="cat-card">
                <span className="cat-card__num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <a href={`#/post/${a.id}`}>
                  <Thumb src={a.image} alt={a.title} variant="wide" label="post.jpg" />
                </a>
                <div className="story__tags">
                  {a.tags.slice(0, 2).map((t) => (
                    <a
                      key={t}
                      href={`#/category/${slugify(t)}`}
                      className="pill pill--sm pill--interactive"
                    >
                      {t}
                    </a>
                  ))}
                </div>
                <h3 className="story__title story__title--sm clamp-2">
                  <a href={`#/post/${a.id}`}>{a.title}</a>
                </h3>
                <p className="cat-card__date">{a.dateFormatted || ""}</p>
              </article>
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="story__excerpt">No stories filed yet. Watch this orbit.</p>
      )}
    </main>
  );
}
