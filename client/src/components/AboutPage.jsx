import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal.jsx";

/* ---------- interactive terminal ---------- */
const COMMANDS = {
  whoami: [
    "SpaceRock — independent publication.",
    "Coverage: AI · Space · Physics · Technology.",
    "Filed weekly from low Earth orbit.",
  ],
  mission: [
    "OBJECTIVE  Explain difficult ideas without making them boring.",
    "STATUS     ACTIVE",
    "FREQUENCY  Weekly.",
    "SIGNAL     Strong.",
  ],
  principles: [
    "01  No clickbait.",
    "02  Fact first.",
    "03  Explain, don't confuse.",
    "04  Quality over speed.",
  ],
  contact: ["MAIL       veer@spacerock.club", "ORBIT      spacerock.club"],
};

function Terminal() {
  const [log, setLog] = useState([
    { cmd: "boot", lines: ["SPACEROCK OS v2.0 — ready.", "Run a command ↓"] },
  ]);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [log]);

  const run = (cmd) =>
    setLog((l) => [...l.slice(-5), { cmd, lines: COMMANDS[cmd] }]);

  return (
    <div className="ab-term">
      <div className="ab-term__bar">
        <span>&gt;_ spacerock — about</span>
        <span className="ab-term__lights"><i /><i /><i /></span>
      </div>
      <div className="ab-term__body" ref={bodyRef}>
        {log.map((entry, i) => (
          <div key={i} className="ab-term__entry">
            <p className="ab-term__cmd">&gt; {entry.cmd}</p>
            {entry.lines.map((ln, j) => (
              <p key={j} className="ab-term__line">{ln}</p>
            ))}
          </div>
        ))}
        <p className="ab-term__cursor">&gt; ▮</p>
      </div>
      <div className="ab-term__cmds">
        {Object.keys(COMMANDS).map((c) => (
          <button key={c} className="ab-term__btn" onClick={() => run(c)}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- count-up stat ---------- */
function Stat({ to, suffix = "", label }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setVal(to);
      return;
    }
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting) && !started) {
          setStarted(true);
          const t0 = performance.now();
          const dur = 1100;
          const tick = (t) => {
            const p = Math.min(1, (t - t0) / dur);
            setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, started]);

  return (
    <div className="ab-stat" ref={ref}>
      <strong>{val}{suffix}</strong>
      <span>{label}</span>
    </div>
  );
}

/* ---------- data ---------- */
const TEAM = [
  {
    name: "Veer Solanki",
    role: "Founder · Writer · Builder",
    bio: "Designs it, codes it, writes it. Too many tabs open at all times.",
    img: "https://cms.spacerock.club/wp-content/uploads/2026/07/IMG20260528192932-scaled.jpg",
    profile: "#/author/veersolanki",
    tilt: -2,
  },
  {
    name: "Nitai Garg",
    role: "Writer · Research",
    bio: "Chases the source until it talks. Allergic to secondhand hype.",
    img: "https://cms.spacerock.club/wp-content/uploads/2026/07/WhatsApp-Image-2025-11-18-at-21.58.30_14d03386-1.jpg",
    profile: "#/author/nitaigarg",
    tilt: 2,
  },
  {
    name: "Aarush Yadav",
    role: "Writer · Technology",
    bio: "Breaks things on purpose so the explainer is honest.",
    img: "https://cms.spacerock.club/wp-content/uploads/2026/07/WhatsApp-Image-2026-07-20-at-3.36.13-AM.jpeg",
    profile: "#/author/aarushyadav",
    tilt: -1,
  },
];

const PRINCIPLES = [
  { icon: "👁", title: "No clickbait", desc: "The headline promises exactly what the story delivers. Nothing more." },
  { icon: "✓", title: "Fact first", desc: "Every claim gets sourced before it gets published. Corrections are public." },
  { icon: "💬", title: "Explain, don't confuse", desc: "If the reader needs a glossary, the draft goes back for another pass." },
  { icon: "◆", title: "Quality over speed", desc: "We'd rather be right on Saturday than wrong on Tuesday." },
];

function initials(name) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("");
}

export default function AboutPage() {
  const journeyRef = useRef(null);
  const scrollJourney = (dir) =>
    journeyRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <main className="ab">
      {/* ---------- Hero + terminal ---------- */}
      <Reveal>
        <section className="ab-hero">
          <div>
            <span className="ab-label">About //</span>
            <h1 className="ab-hero__title">
              Not your <span className="ab-outline">average</span>
              <br />
              <span className="ab-mark">tech blog.</span>
            </h1>
            <p className="ab-hero__sub">
              We cover the ideas that will shape tomorrow — AI, space, physics
              and the technology in between.
            </p>
            <p className="ab-mono">// Filed weekly from low Earth orbit. EST. 2025</p>
          </div>
          <Terminal />
        </section>
      </Reveal>

      {/* ---------- Marquee ---------- */}
      <div className="ab-marquee" aria-hidden="true">
        <div className="ab-marquee__track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k}>
              Stay curious ✦ Keep looking up ✦ Fact first ✦ No clickbait ✦
              Explain everything ✦ The future belongs to the curious ✦&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ---------- Stats ---------- */}
      <Reveal>
        <section>
          <span className="ab-label">By the numbers</span>
          <div className="ab-stats">
            <Stat to={30} suffix="+" label="Articles published" />
            <Stat to={3} label="Core topics" />
            <Stat to={331} label="Cups of coffee drank" />
            <div className="ab-stat">
              <strong>∞</strong>
              <span>Curiosity level</span>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ---------- The crew ---------- */}
      <Reveal>
        <section>
          <span className="ab-label">The crew</span>
          <div className="ab-crew">
            {TEAM.map((m) => (
              <a
                key={m.name}
                className="ab-member"
                href={m.profile}
                target="_blank"
                rel="noreferrer"
                style={{ "--tilt": `${m.tilt}deg` }}
              >
                <div className="ab-member__photo">
                  <img
                    src={m.img}
                    alt={m.name}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextSibling.style.display = "grid";
                    }}
                  />
                  <span className="ab-member__mono" style={{ display: "none" }}>
                    {initials(m.name)}
                  </span>
                </div>
                <h3 className="ab-member__name">{m.name}</h3>
                <p className="ab-member__role">{m.role}</p>
                <p className="ab-member__bio">{m.bio}</p>
                <span className="ab-member__view">View profile →</span>
              </a>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ---------- Principles (hover to reveal) ---------- */}
            <Reveal>
        <section>
          <span className="ab-label">Editorial principles</span>
          <div className="ab-principles">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="ab-principle" tabIndex={0}>
                <div className="ab-principle__front">
                  <span aria-hidden="true">{p.icon}</span>
                  <strong>{p.title}</strong>
                </div>
                <p className="">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>
      
      {/* ---------- Final ---------- */}
      <Reveal>
        <section className="ab-final">
          <div>
            <span className="ab-label ab-label--invert">Final transmission</span>
            <h2>Keep looking up.</h2>
            <p>The future isn&rsquo;t waiting — read about it first.</p>
          </div>
          <a className="ab-final__cta" href="#/">Explore stories →</a>
        </section>
      </Reveal>
    </main>
  );
}
