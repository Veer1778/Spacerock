// Native auth against cms.spacerock.club.
//   - Login/validate: JWT Authentication plugin
//   - Register/account edit: SpaceRock Native Auth plugin (spacerock/v1)
//   - Google: Nextend, launched via our google-url endpoint

const CMS = "https://cms.spacerock.club";
const JWT = `${CMS}/wp-json/jwt-auth/v1`;
const SR = `${CMS}/wp-json/spacerock/v1`;
const ME_URL = `${CMS}/wp-json/wp/v2/users/me`;
const KEY = "sr_auth";

export const CMS_URL = CMS;

export function getAuth() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}

function saveAuth(auth) {
  localStorage.setItem(KEY, JSON.stringify(auth));
  window.dispatchEvent(new Event("sr-auth-change"));
}

export function logout() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("sr-auth-change"));
  // Also end the WordPress session on the CMS so the next Google login
  // shows the account picker instead of silently reusing the WP session.
  // A hidden image ping hits wp-logout; it fails the nonce check but still
  // clears most auth cookies. The dedicated endpoint below is the reliable one.
  try {
    const img = new Image();
    img.src = `${CMS}/wp-json/spacerock/v1/logout?t=${Date.now()}`;
  } catch {
    /* best effort */
  }
}

export async function login(username, password) {
  const res = await fetch(`${JWT}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const json = await res.json().catch(() => ({}));
  const token = json.token || json.data?.token;
  if (!res.ok || !token) {
    const msg =
      json.message || json.data?.message || "Login failed. Check your details.";
    throw new Error(String(msg).replace(/<[^>]*>/g, ""));
  }
  const auth = {
    token,
    name: json.user_display_name || json.data?.displayName || username,
    email: json.user_email || json.data?.email || "",
    slug: json.user_nicename || json.data?.nicename || "",
  };
  saveAuth(auth);
  return auth;
}

export async function register({ username, email, password, name }) {
  const res = await fetch(`${SR}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, name }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.code) {
    throw new Error(
      String(json.message || "Could not create account.").replace(/<[^>]*>/g, "")
    );
  }
  // Auto-login right after registering
  return login(username, password);
}

export async function validate() {
  const auth = getAuth();
  if (!auth?.token) return false;
  try {
    const res = await fetch(`${JWT}/token/validate`, {
      method: "POST",
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    if (!res.ok) throw new Error();
    return true;
  } catch {
    logout();
    return false;
  }
}

export async function fetchMe() {
  const auth = getAuth();
  if (!auth?.token) return null;
  try {
    const res = await fetch(`${ME_URL}?context=edit`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    if (!res.ok) return null;
    const me = await res.json();
    return {
      name: me.name,
      firstName: me.first_name || "",
      lastName: me.last_name || "",
      slug: me.slug,
      email: me.email || auth.email,
      description: me.description || "",
      avatar: me.avatar_urls?.["96"] || me.avatar_urls?.["48"] || null,
      roles: me.roles || [],
    };
  } catch {
    return null;
  }
}

export async function updateAccount(fields) {
  const auth = getAuth();
  if (!auth?.token) throw new Error("Not logged in.");
  const res = await fetch(`${SR}/account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth.token}`,
    },
    body: JSON.stringify(fields),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.code) {
    throw new Error(
      String(json.message || "Update failed.").replace(/<[^>]*>/g, "")
    );
  }
  // Reflect display-name/email changes in the stored session
  if (fields.name || fields.email) {
    saveAuth({
      ...auth,
      name: fields.name || auth.name,
      email: fields.email || auth.email,
    });
  }
  return json;
}

/**
 * Launch Google OAuth via Nextend. After Google, Nextend must be set to
 * redirect to  {CMS}/?sr_oauth_callback=1  which mints a JWT and bounces
 * back to  {SPA}/#/auth-callback?token=...  (handled by ingestCallback).
 */
export function googleLogin() {
  const cb = `${CMS}/?sr_oauth_callback=1`;
  // prompt=select_account forces Google to show the account picker every time
  // instead of silently reusing the last-used Google account.
  window.location.href =
    `${CMS}/wp-login.php?loginSocial=google` +
    `&prompt=select_account` +
    `&redirect=${encodeURIComponent(cb)}`;
}

/**
 * Called on the #/auth-callback route. Reads token+profile from the URL,
 * stores the session, and returns true if a token was found.
 */
export function ingestCallback() {
  // The token can arrive either in the hash query (#/auth-callback?token=...)
  // or, if the server used a real query string, in window.location.search.
  const hash = window.location.hash || "";
  const qIndex = hash.indexOf("?");
  const raw = qIndex !== -1 ? hash.slice(qIndex + 1) : window.location.search.slice(1);
  if (!raw) return false;
  const params = new URLSearchParams(raw);
  const token = params.get("token");
  if (!token) return false;
  saveAuth({
    token: token.trim(),
    name: params.get("name") || "",
    email: params.get("email") || "",
    slug: params.get("slug") || "",
    fresh: true, // just minted — dashboard can trust it without re-validating
  });
  return true;
}
