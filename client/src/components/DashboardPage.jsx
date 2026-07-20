const CMS = "https://cms.spacerock.club";

const ACTIONS = [
  { icon: "👤", title: "My profile", desc: "View your public author page and posts.", href: `${CMS}/account/` },
  { icon: "✏", title: "Edit profile", desc: "Update your name, bio, photo and links.", href: `${CMS}/account/general/` },
  { icon: "🔒", title: "Password & security", desc: "Change your password and login options.", href: `${CMS}/account/password/` },
  { icon: "🔔", title: "Notifications", desc: "Choose what SpaceRock emails you about.", href: `${CMS}/account/notifications/` },
  { icon: "📝", title: "Write for us", desc: "Pitch a story or file a draft from the CMS.", href: `${CMS}/wp-admin/` },
  { icon: "🚪", title: "Log out", desc: "End your session on this device.", href: `${CMS}/logout/` },
];

export default function DashboardPage() {
  return (
    <main className="dash">
      <div className="subpage__head">
        <p className="subpage__eyebrow">// Dashboard</p>
        <h1 className="subpage__title gradient-text">Mission control</h1>
        <p className="subpage__count">
          Manage your account — changes sync from cms.spacerock.club.
        </p>
      </div>

      <div className="dash__grid">
        {ACTIONS.map((a) => (
          <a key={a.title} className="dash__card" href={a.href} target="_blank" rel="noreferrer">
            <span className="dash__icon" aria-hidden="true">{a.icon}</span>
            <strong>{a.title}</strong>
            <p>{a.desc}</p>
            <span className="dash__go" aria-hidden="true">→</span>
          </a>
        ))}
      </div>
    </main>
  );
}
