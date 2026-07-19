export default function PrivacyPage() {
  return (
    <main className="subpage subpage--prose">
      <div className="subpage__head">
        <p className="subpage__eyebrow">Legal</p>
        <h2 className="subpage__title gradient-text">Privacy policy</h2>
        <p className="subpage__count">Last updated: July 2026</p>
      </div>

      <div className="prose">
        <h3>What we collect</h3>
        <p>
          SpaceRock does not require accounts and does not collect personal
          information to read the site. If you contact us by email, we keep
          that correspondence and nothing else.
        </p>
        <h3>Analytics</h3>
        <p>
          We use privacy-respecting, aggregate analytics to understand which
          stories people read. We don&rsquo;t build individual profiles and we
          don&rsquo;t use advertising trackers.
        </p>
        <h3>Cookies</h3>
        <p>
          SpaceRock sets no marketing cookies. Any cookies present are
          strictly functional (for example, remembering that you dismissed a
          notice).
        </p>
        <h3>Your rights</h3>
        <p>
          You can ask us to delete any data we hold about you by writing to{" "}
          <a href="mailto:hello@spacerock.club">hello@spacerock.club</a>. We
          respond within 30 days.
        </p>
        <h3>Changes</h3>
        <p>
          If this policy changes materially, we&rsquo;ll note it on this page
          before the change takes effect.
        </p>
      </div>
    </main>
  );
}
