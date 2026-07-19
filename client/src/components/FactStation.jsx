import { Stripes } from "./ThisJustIn.jsx";

// Position/rotation recipe per card, echoing the reference collage
const LAYOUT = [
  { rotate: -2, x: 0, y: 0 },
  { rotate: 3, x: -46, y: 38 },
  { rotate: -5, x: -52, y: -6 },
  { rotate: 2, x: -40, y: 26 },
  { rotate: -4, x: 120, y: -34 },
];

export default function FactStation({ facts }) {
  return (
    <section id="facts" aria-label="Fact station">
      <div className="section-head section-head--reverse">
        <h2 className="section-head__title gradient-text">Fact station</h2>
        <Stripes />
      </div>

      <div className="facts">
        {facts.map((f, i) => {
          const l = LAYOUT[i % LAYOUT.length];
          return (
            <article
              key={f.id}
              className="fact"
              style={{
                "--rot": `${l.rotate}deg`,
                "--dx": `${l.x}px`,
                "--dy": `${l.y}px`,
              }}
            >
              <div className="fact__bar">
                <span className="fact__label">&gt;_ Fact</span>
                <span className="fact__lights" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
              <p className="fact__text">{f.text}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
