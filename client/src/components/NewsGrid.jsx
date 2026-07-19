import Thumb from "./Thumb.jsx";
import { slugify } from "../App.jsx";

function Tags({ tags, max = 2 }) {
  return (
    <div className="story__tags">
      {tags.slice(0, max).map((t) => (
        <a
          key={t}
          className="pill pill--sm pill--interactive"
          href={`#/category/${slugify(t)}`}
          title={t}
        >
          {t}
        </a>
      ))}
    </div>
  );
}

export default function NewsGrid({ articles }) {
  if (articles.length === 0) {
    return (
      <section className="front" aria-label="Latest stories">
        <p className="story__excerpt">
          Nothing filed under that topic yet. Pick another orbit.
        </p>
      </section>
    );
  }

  const [cover, ...rest] = articles;
  const cards = rest.slice(0, 3);
  const wire = rest.slice(3);

  return (
    <section className="front" aria-label="Latest stories">
      {/* -------- Cover story -------- */}
      <article className="front-cover">
        <span className="front-cover__sticker">Cover story</span>
        <a href={`#/post/${cover.id}`} className="front-cover__media">
          <Thumb src={cover.image} alt={cover.title} variant="cover" label="cover.jpg" />
        </a>
        <div className="front-cover__text">
          <Tags tags={cover.tags} max={3} />
          <h3 className="story__title front-cover__title">
            <a href={`#/post/${cover.id}`}>{cover.title}</a>
          </h3>
          {cover.excerpt && (
            <p className="story__excerpt clamp-3">{cover.excerpt}</p>
          )}
          <div className="front-cover__foot">
            <span className="front__date">{cover.dateFormatted || ""}</span>
            <a className="chip chip--action" href={`#/post/${cover.id}`}>
              Read the story →
            </a>
          </div>
        </div>
      </article>

      {/* -------- Card row -------- */}
      <div className="front-cards">
        {cards.map((a) => (
          <article key={a.id} className="front-card">
            <a href={`#/post/${a.id}`}>
              <Thumb src={a.image} alt={a.title} variant="wide" label="card.jpg" />
            </a>
            <Tags tags={a.tags} max={2} />
            <h3 className="story__title story__title--sm clamp-2">
              <a href={`#/post/${a.id}`}>{a.title}</a>
            </h3>
            {a.excerpt && <p className="story__excerpt clamp-2">{a.excerpt}</p>}
            <span className="front__date front__date--push">
              {a.dateFormatted || ""}
            </span>
          </article>
        ))}
      </div>

      {/* -------- The wire -------- */}
      {wire.length > 0 && (
        <div className="wire">
          <div className="wire__head">
            <span className="wire__label">The wire //</span>
            <span className="wire__hint">more from this week</span>
          </div>
          {wire.map((a, i) => (
            <a key={a.id} className="wire__row" href={`#/post/${a.id}`}>
              <span className="wire__num">{String(i + 1).padStart(2, "0")}</span>
              <span className="wire__title clamp-1">{a.title}</span>
              <span className="wire__tag">{a.tags[0]}</span>
              <span className="wire__date">{a.dateFormatted || ""}</span>
              <span className="wire__arrow" aria-hidden="true">→</span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
