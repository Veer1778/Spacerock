// Native-styled auth pages. Credentials are handled by WordPress
// (Ultimate Member + Nextend Social Login) on cms.spacerock.club —
// these pages give the flow a home inside the site.
const CMS = "https://cms.spacerock.club";

export default function AuthPage({ mode = "login" }) {
  const isLogin = mode === "login";

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
              ? "Log in to comment, save stories and manage your profile."
              : "Create a free account — takes about a minute."}
          </p>

          <a
            className="auth__google"
            href={`${CMS}/login/`}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"/>
              <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.2v3.1C3.2 21.3 7.3 24 12 24z"/>
              <path fill="#FBBC05" d="M5.3 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.2C.4 8.2 0 10 0 12s.4 3.8 1.2 5.4l4.1-3.1z"/>
              <path fill="#EA4335" d="M12 4.7c1.8 0 3.3.6 4.6 1.8l3.4-3.4C18 1.2 15.2 0 12 0 7.3 0 3.2 2.7 1.2 6.6l4.1 3.1c.9-2.9 3.6-5 6.7-5z"/>
            </svg>
            Continue with Google
          </a>

          <div className="auth__divider"><span>or</span></div>

          <a
            className="auth__email"
            href={isLogin ? `${CMS}/login/` : `${CMS}/register/`}
          >
            ✉ Continue with email
          </a>

          <p className="auth__switch">
            {isLogin ? (
              <>New here? <a href="#/signup">Create an account →</a></>
            ) : (
              <>Already aboard? <a href="#/login">Log in →</a></>
            )}
          </p>
        </div>
      </div>

      <p className="auth__note ab-mono">
        // Authentication is handled securely on cms.spacerock.club. You&rsquo;ll
        be sent back after signing in.
      </p>
    </main>
  );
}
