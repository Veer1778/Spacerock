import { useRef, useEffect } from "react";
import Thumb from "./Thumb.jsx";

/**
 * Horizontal carousel: arrows scroll the rail by exactly one card.
 * No card replacement, no re-render — smooth native scroll.
 */
export default function ThisJustIn({ tidbits }) {
  const railRef = useRef(null);

  // Inject the carousel styles once so this stays a single-file edit.
  useEffect(() => {
    if (document.getElementById("tidbit-rail-styles")) return;
    const s = document.createElement("style");
    s.id = "tidbit-rail-styles";
    s.textContent = `
      .tidbits.tidbits--rail {
        display: flex;
        flex-wrap: nowrap;
        gap: clamp(20px, 2.4vw, 36px);
        overflow-x: auto;
        overflow-y: hidden;
        padding: 22px 4px 30px;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .tidbits.tidbits--rail::-webkit-scrollbar { display: none; }
      .tidbits.tidbits--rail .tidbit {
        flex: 0 0 clamp(260px, 26vw, 340px);
        scroll-snap-align: start;
        transform: rotate(var(--tidbit-tilt, 0deg));
        transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.3, 1),
                    box-shadow 0.3s cubic-bezier(0.2, 0.8, 0.3, 1);
      }
      .tidbits.tidbits--rail .tidbit:hover {
        transform: rotate(0deg) translate(-3px, -5px);
      }
    `;
    document.head.appendChild(s);
  }, []);

  const scrollByCard = (dir) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector(".tidbit");
    if (!card) return;
    const gap = parseFloat(getComputedStyle(rail).columnGap || "0") || 0;
    const step = card.getBoundingClientRect().width + gap;
    rail.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section id="tidbits" aria-label="This just in">
      <div className="section-head">
        <h2 className="section-head__title gradient-text">This just in</h2>
        <div className="section-rule" aria-hidden="true" />
        {tidbits.length > 1 && (
          <div className="section-head__nav">
            <button
              className="tray-arrow"
              aria-label="Previous tidbit"
              onClick={() => scrollByCard(-1)}
            >
              ←
            </button>
            <button
              className="tray-arrow"
              aria-label="Next tidbit"
              onClick={() => scrollByCard(1)}
            >
              →
            </button>
          </div>
        )}
      </div>

      <div className="tidbits tidbits--rail" ref={railRef}>
        {tidbits.map((t) => (
          <article
            key={t.id}
            className="tidbit"
            style={{ "--tidbit-tilt": `${t.tilt}deg` }}
          >
            <Thumb
              src={t.image}
              alt={t.title}
              variant="wide"
              label={`${t.id}.jpg`}
            />
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