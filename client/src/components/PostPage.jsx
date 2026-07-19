import { useEffect, useState } from "react";
import Thumb from "./Thumb.jsx";
import Reveal from "./Reveal.jsx";
import { slugify } from "../App.jsx";

function readingMins(post) {
  const words = (post.content || post.excerpt || "")
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Pull the lede out of the article body so it is never repeated below.
 * Rule: take the first paragraph; if it's just a line (<120 chars) and the
 * next element is also a paragraph, take that one too.
 */
function splitLede(html = "") {
  if (!html || typeof document === "undefined") return { lede: "", body: html };
  const div = document.createElement("div");
  div.innerHTML = html;
  const taken = [];
  let el = div.firstElementChild;
  while (el && el.tagName === "P" && taken.length < 2) {
    const next = el.nextElementSibling;
    const text = el.textContent.trim();
    if (text) taken.push(text);
    div.removeChild(el);
    if (taken.join(" ").length >= 120) break;
    el = next;
  }
  return { lede: taken.join(" ").trim(), body: div.innerHTML };
}

export default function PostPage({ id, articles }) {
  const cached = articles.find((a) => a.id === id);
  const [post, setPost] = useState(cached || null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (cached?.content) return;
    fetch(`/api/articles/${encodeURIComponent(id)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setPost)
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound && !post) {
    return (
      <main className="subpage">
        <div className="subpage__head">
          <p className="subpage__eyebrow">404</p>
          <h2 className="subpage__title gradient-text">Lost in space</h2>
          <p className="subpage__count">
            That story isn&rsquo;t here.{" "}
            <a className="subpage__back" href="#/">← Back to the front page</a>
          </p>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <div className="loading">
        <p>&gt;_ loading story<span>▌</span></p>
      </div>
    );
  }

  const related = articles
    .filter(
      (a) =>
        a.id !== post.id &&
        (post.tags || []).some((t) => (a.tags || []).includes(t))
    )
    .slice(0, 3);

  const { lede, body } = splitLede(post.content);

  // Load Twitter/X widgets when the body contains a tweet embed.
  useEffect(() => {
    if (!body || !/twitter-tweet|platform\.twitter\.com/.test(body)) return;
    const load = () => window.twttr?.widgets?.load();
    if (window.twttr?.widgets) {
      load();
      return;
    }
    let script = document.getElementById("twitter-wjs");
    if (!script) {
      script = document.createElement("script");
      script.id = "twitter-wjs";
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.onload = load;
      document.body.appendChild(script);
    } else {
      script.addEventListener("load", load, { once: true });
    }
  }, [body]);

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <main className="post">
      {/* Top bar: back + tags + reading time */}
      <div className="post__topbar">
        <a className="chip chip--back" href="#/">← Front page</a>
        <div className="post__topbar-tags">
          {(post.tags || []).slice(0, 3).map((t) => (
            <a key={t} className="chip" href={`#/category/${slugify(t)}`}>
              {t}
            </a>
          ))}
        </div>
        <span className="chip chip--ghost">{readingMins(post)} min read</span>
      </div>

      {/* Cover with overlapping title card */}
      <div className="post__cover">
        <Thumb src={post.image} alt={post.title} variant="hero" label="cover.jpg" />
        <div className="post__titlecard">
          <h1 className="post__title">{post.title}</h1>
          <div className="post__meta-row">
            <span className="post__date">{post.dateFormatted || post.date}</span>
            <a
              className="post__author"
              href={post.author?.profileUrl || "#"}
              target={post.author?.profileUrl ? "_blank" : undefined}
              rel="noreferrer"
              title={post.author?.name ? `View ${post.author.name}'s profile` : ""}
            >
              {post.author?.avatar ? (
                <img className="post__avatar" src={post.author.avatar} alt="" />
              ) : (
                <span className="post__avatar post__avatar--initials">
                  {(post.author?.name || "SR")
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </span>
              )}
              {post.author?.name || "SpaceRock"}
            </a>
          </div>
        </div>
      </div>

      {lede && (
        <Reveal>
          <p className="post__standfirst">{lede}</p>
        </Reveal>
      )}

      <Reveal>
        <div className="post__paper">
          {post.content ? (
            <div className="prose" dangerouslySetInnerHTML={{ __html: body }} />
          ) : (
            <div className="prose">
              <p>{post.excerpt}</p>
              {post.link && (
                <p>
                  <a href={post.link} target="_blank" rel="noreferrer">
                    Continue reading on spacerock.club →
                  </a>
                </p>
              )}
            </div>
          )}
          <div className="post__actions">
            <button className="chip chip--action" onClick={copyLink}>
              {copied ? "✓ Copied" : "⎘ Copy link"}
            </button>
          </div>
        </div>
      </Reveal>

      {related.length > 0 && (
        <Reveal>
          <aside className="post__related">
            <div className="section-head">
              <h3 className="section-head__title gradient-text">Keep reading</h3>
              <div className="section-rule" aria-hidden="true" />
            </div>
            <div className="cat-grid cat-grid--related">
              {related.map((a, i) => (
                <article key={a.id} className="cat-card">
                  <span className="cat-card__num">{String(i + 1).padStart(2, "0")}</span>
                  <a href={`#/post/${a.id}`}>
                    <Thumb src={a.image} alt={a.title} variant="wide" label="rel.jpg" />
                  </a>
                  <h4 className="story__title story__title--sm clamp-2">
                    <a href={`#/post/${a.id}`}>{a.title}</a>
                  </h4>
                </article>
              ))}
            </div>
          </aside>
        </Reveal>
      )}
    </main>
  );
}
