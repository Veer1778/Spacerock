export default function Ticker({ articles }) {
  const titles = articles.slice(0, 6).map((a) => ({ id: a.id, title: a.title }));
  if (!titles.length) return null;
  // Duplicate the list so the loop is seamless
  const loop = [...titles, ...titles];

  return (
    <div className="ticker" aria-label="Top stories">
      <span className="ticker__label">Top stories</span>
      <div className="ticker__viewport">
        <div className="ticker__track">
          {loop.map((t, i) => (
            <a key={`${t.id}-${i}`} className="ticker__item" href={`#/post/${t.id}`}>
              {t.title}
              <span className="ticker__star" aria-hidden="true">✦</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
