import { useState } from "react";
import { login, register, googleLogin } from "../auth.js";

function GoogleButton() {
  return (
    <button className="auth__google" onClick={() => googleLogin()} type="button">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"/>
        <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.2v3.1C3.2 21.3 7.3 24 12 24z"/>
        <path fill="#FBBC05" d="M5.3 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.2C.4 8.2 0 10 0 12s.4 3.8 1.2 5.4l4.1-3.1z"/>
        <path fill="#EA4335" d="M12 4.7c1.8 0 3.3.6 4.6 1.8l3.4-3.4C18 1.2 15.2 0 12 0 7.3 0 3.2 2.7 1.2 6.6l4.1 3.1c.9-2.9 3.6-5 6.7-5z"/>
      </svg>
      Continue with Google
    </button>
  );
}

export default function AuthPage({ mode = "login" }) {
  const isLogin = mode === "login";
  const [f, setF] = useState({ username: "", email: "", password: "", name: "" });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  async function submit(e) {
    e?.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      if (isLogin) {
        await login(f.username, f.password);
      } else {
        await register({
          username: f.username,
          email: f.email,
          password: f.password,
          name: f.name || f.username,
        });
      }
      window.location.hash = "#/dashboard";
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth">
      <div className="auth__card">
        <div className="auth__bar">
          <span>&gt;_ {isLogin ? "crew login" : "join the crew"}</span>
          <span className="fact__lights"><i /><i /><i /></span>
        </div>

        <div className="auth__body">
          <h1 className="auth__title">
            {isLogin ? "Welcome back." : "Get your callsign."}
          </h1>
          <p className="auth__sub">
            {isLogin
              ? "Log in to manage your profile and file stories."
              : "Create a free account — takes about a minute."}
          </p>

          <GoogleButton />
          <div className="auth__divider"><span>or</span></div>

          <form className="auth__form" onSubmit={submit}>
            {!isLogin && (
              <label className="auth__field">
                <span>Display name</span>
                <input type="text" value={f.name} onChange={set("name")} autoComplete="name" />
              </label>
            )}

            <label className="auth__field">
              <span>{isLogin ? "Username or email" : "Username"}</span>
              <input
                type="text"
                value={f.username}
                onChange={set("username")}
                autoComplete="username"
                required
              />
            </label>

            {!isLogin && (
              <label className="auth__field">
                <span>Email</span>
                <input type="email" value={f.email} onChange={set("email")} autoComplete="email" required />
              </label>
            )}

            <label className="auth__field">
              <span>Password</span>
              <input
                type="password"
                value={f.password}
                onChange={set("password")}
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
              />
            </label>

            {error && <p className="auth__error">⚠ {error}</p>}

            <button className="auth__submit" type="submit" disabled={busy}>
              {busy
                ? isLogin ? "Authenticating…" : "Creating account…"
                : isLogin ? "Log in →" : "Create account →"}
            </button>
          </form>

          <p className="auth__switch">
            {isLogin ? (
              <>New here? <a href="#/signup">Create an account →</a></>
            ) : (
              <>Already aboard? <a href="#/login">Log in →</a></>
            )}
          </p>
        </div>
      </div>
    </main>
  );
}
