import { useEffect, useState } from "react";
import { getAuth, validate, fetchMe, logout, CMS_URL } from "../auth.js";

const ACTIONS = [
  { icon: "✏", title: "Edit profile", desc: "Update your name, bio, email and password.", href: "#/account" },
  { icon: "👤", title: "My author page", desc: "See your public profile and every story you've filed.", href: "author" },
  { icon: "📝", title: "Write for us", desc: "Pitch a story or file a draft.", href: `${CMS_URL}/wp-admin/post-new.php` },
];

export default function DashboardPage() {
  const [state, setState] = useState("checking"); // checking | out | in
  const [me, setMe] = useState(null);

  useEffect(() => {
    (async () => {
      const auth = getAuth();
      if (!auth) return setState("out");
      // Freshly minted tokens (Google callback) are trusted without a
      // validate round-trip; consume the flag so later visits re-validate.
      if (!auth.fresh) {
        const ok = await validate();
        if (!ok) return setState("out");
      } else {
        localStorage.setItem("sr_auth", JSON.stringify({ ...auth, fresh: false }));
      }
      setState("in");
      setMe((await fetchMe()) || { name: auth.name, email: auth.email });
    })();
  }, []);

  if (state === "checking") return null;

  if (state === "out") {
    return (
      <main className="auth">
        <div className="auth__card">
          <div className="auth__bar">
            <span>&gt;_ access denied</span>
            <span className="fact__lights"><i /><i /><i /></span>
          </div>
          <div className="auth__body">
            <h1 className="auth__title">You&rsquo;re not logged in.</h1>
            <p className="auth__sub">
              Mission control is crew-only. Authenticate to continue.
            </p>
            <a className="auth__submit" href="#/login" style={{ textAlign: "center" }}>
              Log in →
            </a>
          </div>
        </div>
      </main>
    );
  }

  const auth = getAuth();
  const initials = (me?.name || "SR")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <main className="dash">
      {/* Logged-in identity strip */}
      <div className="dash__id">
        <div className="dash__id-left">
          <span className="dash__avatar">
            {me?.avatar ? <img src={me.avatar} alt="" /> : initials}
          </span>
          <div>
            <p className="subpage__eyebrow">// Logged in</p>
            <h1 className="dash__name">{me?.name || auth?.name}</h1>
            {me?.email && <p className="dash__email">{me.email}</p>}
          </div>
        </div>
        <div className="dash__id-actions">
          <button
            className="chip"
            onClick={() => {
              logout();
              window.location.hash = "#/";
            }}
          >
            🚪 Log out
          </button>
        </div>
      </div>

      <div className="dash__grid">
        {ACTIONS.map((a) => {
          const href = a.href === "author" ? (me?.slug ? `#/author/${me.slug}` : "#/") : a.href;
          const external = href.startsWith("http");
          return (
          <a
            key={a.title}
            className="dash__card"
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
          >
            <span className="dash__icon" aria-hidden="true">{a.icon}</span>
            <strong>{a.title}</strong>
            <p>{a.desc}</p>
            <span className="dash__go" aria-hidden="true">→</span>
          </a>
          );
        })}
      </div>
    </main>
  );
}
