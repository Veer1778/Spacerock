import { useRef } from "react";

function Starburst() {
  const points = [];
  const spikes = 16;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? 60 : 38;
    const a = (Math.PI * i) / spikes;
    points.push(`${60 + r * Math.sin(a)},${60 - r * Math.cos(a)}`);
  }
  return (
    <div className="masthead__badge" aria-hidden="true">
      <svg viewBox="0 0 120 120" className="masthead__star">
        <polygon points={points.join(" ")} />
      </svg>
      <span className="masthead__badge-text">
        EST.
        <br />
        2025
      </span>
    </div>
  );
}

export default function Hero({ topics, activeTopic, onTopicSelect }) {
  const railRef = useRef(null);
  const scroll = (dir) =>
    railRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });

  return (
    <section className="masthead" aria-label="SpaceRock">
      <div className="masthead__row">
        <h2 className="masthead__title">
          Stories from the <span className="masthead__outline">edge</span> of the{" "}
          <span className="masthead__mark">universe</span>
        </h2>
        <Starburst />
      </div>
      <p className="masthead__sub">
        AI &middot; Physics &middot; Tech &mdash; filed weekly from low orbit.
      </p>

      <div className="topic-tray" role="group" aria-label="Filter stories by tag">
        <span className="topic-tray__label">Filter&nbsp;//</span>
        <button
          className="tray-arrow"
          aria-label="Scroll tags left"
          onClick={() => scroll(-1)}
        >
          ←
        </button>
        <div className="topic-tray__pills" ref={railRef}>
          {topics.map((topic) => (
            <button
              key={topic}
              className={`pill pill--lg pill--interactive ${
                activeTopic === topic ? "pill--active" : ""
              }`}
              aria-pressed={activeTopic === topic}
              onClick={() => onTopicSelect(topic)}
            >
              {topic}
            </button>
          ))}
          {activeTopic && (
            <button
              className="pill pill--lg pill--clear"
              onClick={() => onTopicSelect(activeTopic)}
            >
              ✕ Clear
            </button>
          )}
        </div>
        <button
          className="tray-arrow"
          aria-label="Scroll tags right"
          onClick={() => scroll(1)}
        >
          →
        </button>
      </div>
    </section>
  );
}
