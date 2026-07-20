// Native auth against the JWT Authentication plugin on cms.spacerock.club.
// Token is stored locally; every helper degrades gracefully if the
// endpoints are unreachable.

const CMS = "https://cms.spacerock.club";
const TOKEN_URL = `${CMS}/wp-json/jwt-auth/v1/token`;
const VALIDATE_URL = `${CMS}/wp-json/jwt-auth/v1/token/validate`;
const ME_URL = `${CMS}/wp-json/wp/v2/users/me`;
const KEY = "sr_auth";

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

/** Log in with WP username/email + password. Returns the auth object or throws. */
export async function login(username, password) {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const json = await res.json().catch(() => ({}));

  // Two popular plugins, two response shapes — handle both.
  const token = json.token || json.data?.token;
  if (!res.ok || !token) {
    const msg =
      json.message ||
      json.data?.message ||
      "Login failed. Check your username and password.";
    throw new Error(String(msg).replace(/<[^>]*>/g, ""));
  }

  const auth = {
    token,
    name:
      json.user_display_name ||
      json.data?.displayName ||
      json.data?.nicename ||
      username,
    email: json.user_email || json.data?.email || "",
    slug: json.user_nicename || json.data?.nicename || "",
  };
  saveAuth(auth);
  return auth;
}

/** Confirm the stored token is still valid; clears it if not. */
export async function validate() {
  const auth = getAuth();
  if (!auth?.token) return false;
  try {
    const res = await fetch(VALIDATE_URL, {
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

/** Fetch the logged-in user's full profile (avatar, roles, etc.). */
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
      slug: me.slug,
      email: me.email || auth.email,
      avatar: me.avatar_urls?.["96"] || me.avatar_urls?.["48"] || null,
      roles: me.roles || [],
    };
  } catch {
    return null;
  }
}

export const CMS_URL = CMS;
