import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header.jsx";
import Hero from "./components/Hero.jsx";
import NewsGrid from "./components/NewsGrid.jsx";
import ThisJustIn from "./components/ThisJustIn.jsx";
import FactStation from "./components/FactStation.jsx";
import Footer from "./components/Footer.jsx";
import { lazy, Suspense } from "react";
const CategoryPage = lazy(() => import("./components/CategoryPage.jsx"));
const AboutPage = lazy(() => import("./components/AboutPage.jsx"));
const PrivacyPage = lazy(() => import("./components/PrivacyPage.jsx"));
const PostPage = lazy(() => import("./components/PostPage.jsx"));
const AuthorPage = lazy(() => import("./components/AuthorPage.jsx"));
const AuthPage = lazy(() => import("./components/AuthPage.jsx"));
const DashboardPage = lazy(() => import("./components/DashboardPage.jsx"));
const AccountPage = lazy(() => import("./components/AccountPage.jsx"));
import { ingestCallback } from "./auth.js";
import Reveal from "./components/Reveal.jsx";
import Ticker from "./components/Ticker.jsx";

/* ------------------------------------------------------------------
   Hash router: #/  #/category/<slug>  #/post/<id>  #/about  #/privacy
   ------------------------------------------------------------------ */
function parseRoute() {
  const hash = window.location.hash;
  if (!hash.startsWith("#/")) return { page: "home" };
  const parts = hash.slice(2).split("/").filter(Boolean);
  if (parts[0] === "category" && parts[1])
    return { page: "category", slug: decodeURIComponent(parts[1]) };
  if (parts[0] === "post" && parts[1])
    return { page: "post", id: decodeURIComponent(parts[1]) };
  if (parts[0] === "author" && parts[1])
    return { page: "author", slug: decodeURIComponent(parts[1]) };
  if (parts[0] === "login") return { page: "login" };
  if (parts[0] === "signup") return { page: "signup" };
  if (parts[0] === "auth-callback") return { page: "auth-callback" };
  if (parts[0] === "dashboard") return { page: "dashboard" };
  if (parts[0] === "account") return { page: "account" };
  if (parts[0] === "about") return { page: "about" };
  if (parts[0] === "privacy") return { page: "privacy" };
  return { page: "home" };
}

function useHashRoute() {
  const [route, setRoute] = useState(parseRoute);
  useEffect(() => {
    const onChange = () => {
      setRoute(parseRoute());
      if (window.location.hash.startsWith("#/")) window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

// (auth callback handled below)
// Fade out the instant splash from index.html.
function hideSplash() {
  const el = document.getElementById("sr-splash");
  if (el && !el.classList.contains("sr-hide")) {
    el.classList.add("sr-hide");
    setTimeout(() => el.remove(), 600);
  }
}

export const slugify = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const ALIAS_GROUPS = [
  ["ai", "artificial-intelligence"],
  ["tech", "technology"],
];

export function tagMatchesSlug(tag, slug) {
  const t = slugify(tag);
  if (t === slug) return true;
  return ALIAS_GROUPS.some((g) => g.includes(t) && g.includes(slug));
}

/** Most common tags across the fetched posts, used as a fallback. */
function topTags(articles, limit = 12) {
  const counts = new Map();
  for (const a of articles) {
    for (const t of a.tags || []) {
      const key = typeof t === "string" ? t.trim() : t?.name;
      if (key) counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([t]) => t);
}

export default function App() {
  const route = useHashRoute();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTopic, setActiveTopic] = useState(null);

  useEffect(() => {
    // Hard cap: never show the splash longer than 6s.
    const cap = setTimeout(hideSplash, 6000);
    fetch("/api/home")
      .then((r) => {
        if (!r.ok) throw new Error(`API responded ${r.status}`);
        return r.json();
      })
      .then((d) => {
        setData(d);
        hideSplash();
      })
      .catch((e) => {
        setError(e.message);
        hideSplash();
      })
      .finally(() => clearTimeout(cap));
  }, []);

  // Topics arrive from the server ranked by usage. Normalize defensively:
  // accept plain strings or {name} objects so a shape change can never
  // blank the page.
  const topics = useMemo(() => {
    if (!data) return [];
    const raw = data.topics?.length ? data.topics : topTags(data.articles);
    return raw
      .map((t) => (typeof t === "string" ? t : t?.name))
      .filter(Boolean);
  }, [data]);

  if (error) {
    return (
      <div className="page-error">
        <p>Couldn&rsquo;t load stories right now. Please try again in a moment.</p>
      </div>
    );
  }

  if (!data) {
    // No loader — render nothing until content is ready.
    return null;
  }

  const { articles, tidbits, facts } = data;

  // #/auth-callback is handled in main.jsx before mount; if we somehow land
  // here, just fall through to a blank while the redirect completes.
  if (route.page === "auth-callback") return null;

  let content;
  if (route.page === "category") {
    content = <CategoryPage slug={route.slug} articles={articles} />;
  } else if (route.page === "post") {
    content = <PostPage id={route.id} articles={articles} />;
  } else if (route.page === "author") {
    content = <AuthorPage slug={route.slug} />;
  } else if (route.page === "login") {
    content = <AuthPage mode="login" />;
  } else if (route.page === "signup") {
    content = <AuthPage mode="signup" />;
  } else if (route.page === "dashboard") {
    content = <DashboardPage />;
  } else if (route.page === "account") {
    content = <AccountPage />;
  } else if (route.page === "about") {
    content = <AboutPage />;
  } else if (route.page === "privacy") {
    content = <PrivacyPage />;
  } else {
    const visibleArticles = activeTopic
      ? articles.filter((a) =>
          (a.tags || []).some((t) => tagMatchesSlug(t, slugify(activeTopic)))
        )
      : articles;
    content = (
      <>
        <Ticker articles={articles} />
        <Hero
          topics={topics}
          activeTopic={activeTopic}
          onTopicSelect={(t) =>
            setActiveTopic((cur) => (cur === t ? null : t))
          }
        />
        <Reveal>
          <NewsGrid articles={visibleArticles} />
        </Reveal>
        <Reveal>
          <ThisJustIn tidbits={tidbits} />
        </Reveal>
        <Reveal>
          <FactStation facts={facts} />
        </Reveal>
      </>
    );
  }

  return (
    <div className="page">
      <Header />
      <div
        key={route.page + (route.slug || route.id || "")}
        className="route-fade"
      >
        <Suspense fallback={null}>{content}</Suspense>
      </div>
      <Footer topics={topics.slice(0, 6)} />
    </div>
  );
}
