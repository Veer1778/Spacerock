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

/** Launch Google OAuth (Nextend) and return here afterwards. */
export async function googleLogin() {
  const redirect = window.location.origin + "/#/dashboard";
  try {
    const res = await fetch(`${SR}/google-url?redirect=${encodeURIComponent(redirect)}`);
    const json = await res.json();
    if (json.url) {
      window.location.href = json.url;
      return;
    }
  } catch {
    /* fall through */
  }
  // Fallback: standard Nextend trigger
  window.location.href = `${CMS}/wp-login.php?loginSocial=google`;
}
