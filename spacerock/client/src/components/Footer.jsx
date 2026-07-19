import { slugify } from "../App.jsx";

const SITE = [
  { label: "This just in", href: "#tidbits" },
  { label: "Fact station", href: "#facts" },
  { label: "About", href: "#/about" },
  { label: "Privacy policy", href: "#/privacy" },
];
const SOCIAL = [
  { label: "X / Twitter", href: "https://x.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "RSS", href: "/feed" },
];

export default function Footer({ topics = [] }) {
  const topicList = (topics.length
    ? topics.slice(0, 6)
    : [
        { name: "AI", slug: "ai" },
        { name: "Tech", slug: "tech" },
        { name: "Physics", slug: "physics" },
      ]
  ).map((t) => (typeof t === "string" ? { name: t, slug: slugify(t) } : t));

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <span className="footer__wordmark gradient-text">SPACEROCK</span>
          <p className="footer__tagline">
            Stories from the edge of the universe. AI, physics, space and the
            technology reshaping all three — written for people who read past
            the headline.
          </p>
        </div>

        <div className="footer__cols">
          <div className="footer__col">
            <h4 className="footer__heading">Topics</h4>
            {topicList.map((t) => (
              <a key={t.slug} className="footer__link" href={`#/category/${t.slug}`}>
                {t.name}
              </a>
            ))}
          </div>
          <div className="footer__col">
            <h4 className="footer__heading">Site</h4>
            {SITE.map((s) => (
              <a key={s.label} className="footer__link" href={s.href}>
                {s.label}
              </a>
            ))}
          </div>
          <div className="footer__col">
            <h4 className="footer__heading">Follow</h4>
            {SOCIAL.map((s) => (
              <a
                key={s.label}
                className="footer__link"
                href={s.href}
                target="_blank"
                rel="noreferrer"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__meta">
          © {new Date().getFullYear()} SpaceRock · spacerock.club ·{" "}
          <a href="#/privacy" className="footer__link footer__link--inline">
            Privacy
          </a>
        </p>
        <p className="footer__meta">Filed from low orbit since 2025 ✦</p>
      </div>
    </footer>
  );
}
