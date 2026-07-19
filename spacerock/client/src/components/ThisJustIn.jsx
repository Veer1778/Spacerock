import { useState } from "react";
import Thumb from "./Thumb.jsx";

function Stripes() {
  return <div className="section-rule" aria-hidden="true" />;
}

const PAGE = 4;

export default function ThisJustIn({ tidbits }) {
  const [start, setStart] = useState(0);
  const canPrev = start > 0;
  const canNext = start + PAGE < tidbits.length;
  const view = tidbits.slice(start, start + PAGE);

  return (
    <section id="tidbits" aria-label="This just in">
      <div className="section-head">
        <h2 className="section-head__title gradient-text">This just in</h2>
        <Stripes />
        {tidbits.length > PAGE && (
          <div className="section-head__nav">
            <button
              className="tray-arrow"
              aria-label="Newer tidbits"
              disabled={!canPrev}
              onClick={() => setStart((s) => Math.max(0, s - PAGE))}
            >
              ←
            </button>
            <button
              className="tray-arrow"
              aria-label="Older tidbits"
              disabled={!canNext}
              onClick={() =>
                setStart((s) => Math.min(tidbits.length - 1, s + PAGE))
              }
            >
              →
            </button>
          </div>
        )}
      </div>

      <div className="tidbits" key={start}>
        {view.map((t) => (
          <article
            key={t.id}
            className="tidbit"
            style={{ transform: `rotate(${t.tilt}deg)` }}
          >
            <Thumb src={t.image} alt={t.title} variant="wide" label={`${t.id}.jpg`} />
            <p className="tidbit__date">{t.date}</p>
            <h3 className="tidbit__title clamp-2">
              <a href={`#/post/${t.id}`}>{t.title}</a>
            </h3>
            <p className="tidbit__excerpt clamp-4">
              {t.excerpt || "Read the full tidbit on SpaceRock."}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export { Stripes };
