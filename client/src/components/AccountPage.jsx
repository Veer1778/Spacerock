import { useEffect, useState } from "react";
import { getAuth, validate, fetchMe, updateAccount } from "../auth.js";

export default function AccountPage() {
  const [state, setState] = useState("checking"); // checking | out | ready
  const [f, setF] = useState({
    name: "", first_name: "", last_name: "", email: "", description: "", password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      if (!getAuth()) return setState("out");
      if (!(await validate())) return setState("out");
      const me = await fetchMe();
      if (me) {
        setF({
          name: me.name || "",
          first_name: me.firstName || "",
          last_name: me.lastName || "",
          email: me.email || "",
          description: me.description || "",
          password: "",
        });
        setAvatar(me.avatar);
      }
      setState("ready");
    })();
  }, []);

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  async function save(e) {
    e?.preventDefault();
    if (busy) return;
    setBusy(true);
    setMsg(null);
    try {
      const payload = { ...f };
      if (!payload.password) delete payload.password; // don't blank the password
      await updateAccount(payload);
      setMsg({ ok: true, text: "Saved. Your changes are live." });
      setF((s) => ({ ...s, password: "" }));
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  }

  if (state === "checking") return <main className="account" />;

  if (state === "out") {
    return (
      <main className="auth">
        <div className="auth__card">
          <div className="auth__bar"><span>&gt;_ access denied</span></div>
          <div className="auth__body">
            <h1 className="auth__title">Log in first.</h1>
            <a className="auth__submit" href="#/login" style={{ textAlign: "center" }}>Log in →</a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="account">
      <div className="subpage__head">
        <p className="subpage__eyebrow">// Account</p>
        <h1 className="subpage__title gradient-text">Edit profile</h1>
      </div>

      <form className="account__grid" onSubmit={save}>
        <aside className="account__side">
          <div className="account__avatar">
            {avatar ? <img src={avatar} alt="" /> : <span>SR</span>}
          </div>
          <p className="account__hint">
            Avatar is managed by your Gravatar / profile photo on your account.
          </p>
          <a className="chip chip--action" href="#/dashboard">← Dashboard</a>
        </aside>

        <div className="account__fields">
          <div className="account__row">
            <label className="auth__field">
              <span>Display name</span>
              <input value={f.name} onChange={set("name")} />
            </label>
          </div>
          <div className="account__row account__row--split">
            <label className="auth__field">
              <span>First name</span>
              <input value={f.first_name} onChange={set("first_name")} />
            </label>
            <label className="auth__field">
              <span>Last name</span>
              <input value={f.last_name} onChange={set("last_name")} />
            </label>
          </div>
          <label className="auth__field">
            <span>Email</span>
            <input type="email" value={f.email} onChange={set("email")} />
          </label>
          <label className="auth__field">
            <span>Bio</span>
            <textarea rows={4} value={f.description} onChange={set("description")} />
          </label>
          <label className="auth__field">
            <span>New password <em>(leave blank to keep current)</em></span>
            <input type="password" value={f.password} onChange={set("password")} autoComplete="new-password" />
          </label>

          {msg && (
            <p className={msg.ok ? "account__ok" : "auth__error"}>
              {msg.ok ? "✓ " : "⚠ "}{msg.text}
            </p>
          )}

          <button className="auth__submit" type="submit" disabled={busy} style={{ width: "fit-content" }}>
            {busy ? "Saving…" : "Save changes →"}
          </button>
        </div>
      </form>
    </main>
  );
}
